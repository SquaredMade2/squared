import "tslib";
import { randomBytes } from "node:crypto";
import * as context from "@squared/context";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { z } from "zod";

import type { Logger } from "@squared/logger";
import {
	type Method,
	type MethodDetails,
	ResponseValidationError,
	type Service,
	type ServiceDetails,
	type ServiceSet,
	ValidationError,
	requestContexts,
	serviceWithSchema,
} from "./rpc-types";

export * from "./rpc-types";

export class RpcError extends Error {
	constructor(
		public serviceName: string,
		public methodName: string,
		public inner: Error & { type?: string; code?: string | number },
	) {
		super(
			`An error occurred while executing method ${serviceName}/${methodName}`,
		);
		this.name = "RpcError";
	}
}

function getExposedMeta(serviceDetails: ServiceDetails) {
	return {
		serviceName: serviceDetails.service,
		multiArg: false,
		help: serviceDetails.help || `${serviceDetails.service} service`,
		interfaces: serviceDetails.expose.map((method: MethodDetails) => {
			const {
				methodName,
				methodTimeout = 60000,
				help,
				paramNames = [],
				requestSchema,
				responseSchema,
			} = method;

			return {
				methodName,
				paramNames,
				methodTimeout,
				help: help || `${methodName} method`,
				requestSchema,
				responseSchema,
			};
		}),
	};
}

export function createRequestHandler(
	// biome-ignore lint/suspicious/noExplicitAny: Methods are defined by the user
	services: ServiceSet<any>[],
): RequestHandler {
	const postHandlers = new Map<string, RequestHandler>();
	const getHandlers = new Map<string, RequestHandler>();

	const meta = {
		services: Object.values(services.map((s) => getExposedMeta(s.meta))),
	};

	getHandlers.set("/", (_, res) => {
		res.json(meta);
	});

	for (const service of services) {
		const serviceName = service.meta.service;
		const serviceMeta = meta.services.find(
			(s) => s.serviceName === serviceName,
		);

		getHandlers.set(`/${serviceName}`, (_, res) => {
			res.json(serviceMeta);
		});

		for (const methodDef of service.meta.expose) {
			const { methodName } = methodDef;
			const methodMeta = serviceMeta?.interfaces.find(
				(s) => s.methodName === methodName,
			);

			const getHandler: RequestHandler = (_, res) => {
				res.json(methodMeta);
			};
			getHandlers.set(`/${serviceName}/${methodName}`, getHandler);

			const methodFn = service.implementation[methodName].bind(
				service.implementation,
			);

			const postHandler: RequestHandler = async (req, res, next) => {
				let abortable: context.Abortable | null = null;
				try {
					const requestDeadline = first(req.headers["x-request-deadline"]);

					if (requestDeadline) {
						abortable = context.withDeadline(
							context.background,
							Date.parse(requestDeadline),
						);
					} else {
						abortable = context.withAbort(context.background);
					}

					const ctx = context.withValues(abortable.ctx, {
						[context.requestIdKey]:
							first(req.headers["x-request-id"]) ||
							randomBytes(6).toString("base64url"),
					});

					res.on("finish", () => abortable?.abort());

					requestContexts.set(req, ctx);
					const result = await methodFn(req.body);
					res.json(result);

					// biome-ignore lint/suspicious/noExplicitAny: Error has to be any
				} catch (err: any) {
					next(new RpcError(serviceName, methodName, err));
				} finally {
					abortable?.abort();
				}
			};

			postHandlers.set(`/${serviceName}/${methodName}`, postHandler);
		}
	}

	return async (req, res, next) => {
		let handler: RequestHandler | undefined;
		switch (req.method) {
			case "GET":
				handler = getHandlers.get(req.path);
				break;
			case "POST":
				handler = postHandlers.get(req.path);
				break;
		}

		if (!handler) {
			return next();
		}

		handler(req, res, next);
	};
}

export function createErrorHandler(
	args: { log?: Logger } = {},
): ErrorRequestHandler {
	const { log } = args;
	return (err, _, res, next) => {
		if (err instanceof RpcError) {
			const source = `${err.serviceName}/${err.methodName}`;
			log?.error(`Error executing ${source}: ${err.inner.stack}`);
			if (
				err.inner instanceof ValidationError ||
				err.inner instanceof ResponseValidationError
			) {
				res.status(400).json({
					message: err.inner.message,
					code: err.inner.code,
					type: err.inner.type,
					params: err.inner.params,
				});
			} else {
				res.status(400).json({
					message: err.inner.message,
					code: err.inner.code || "unknown_error",
					type:
						err.inner.type ||
						"https://errors.squared.global/@squared/rpc/unknown-error",
				});
			}
		} else {
			log?.error(`Internal error: ${err.stack || err.message}`);
			res.status(500).json({ message: "Internal Server Error" });
		}
		next();
	};
}

function first(s: string | string[] | undefined) {
	if (!s) return undefined;
	return Array.isArray(s) ? s[0] : s;
}

type SchemaFor<T> = z.ZodType<T, z.ZodTypeDef, T>;

export function createSchema<T>() {
	return <S extends SchemaFor<T>>(schema: S) => schema;
}

export function createServiceSchema<T>() {
	// Define the structure expected for each method in the schema
	type ServiceDefinition = {
		[K in keyof T]: T[K] extends (arg: infer Input) => Promise<infer Output>
			? { input: z.ZodType<Input>; output: z.ZodType<Output> }
			: never;
	};

	// Accept the schema argument and enforce the structure with ServiceDefinition
	return <S extends ServiceDefinition>(schema: S): S => {
		{
			const strictSchema = Object.fromEntries(
				(Object.entries(schema) as [keyof S, S[keyof S]][]).map(
					([key, value]) => [
						key,
						{
							input:
								value.input instanceof z.ZodObject
									? value.input.strict()
									: value.input,
							output:
								value.output instanceof z.ZodObject
									? value.output.strict()
									: value.output,
						},
					],
				),
			) as S;
	
			return strictSchema;
		}
	};
}

export function createRpcHandler<
	T extends Record<
		string,
		{
			// biome-ignore lint/suspicious/noExplicitAny: ZodType requires these any types for flexibility
			input: z.ZodType<any, z.ZodTypeDef, any>;
			// biome-ignore lint/suspicious/noExplicitAny: ZodType requires these any types for flexibility
			output: z.ZodType<any, z.ZodTypeDef, any>;
		}
	>,
>(
	serviceName: string,
	schema: T,
	implementation: {
		[K in keyof T]: (
			input: z.infer<T[K]["input"]>,
		) => Promise<z.infer<T[K]["output"]>>;
	},
	logger: Logger,
): ServiceSet<Service> {
	const expose: MethodDetails[] = Object.entries(schema).map(
		([methodName, { input, output }]) => ({
			methodName,
			requestSchema: input,
			responseSchema: output,
		}),
	);

	const { interfaces } = getExposedMeta({ expose, service: serviceName });
	const serviceMethods = interfaces.reduce(
		(init, curr) => {
			return {
				// biome-ignore lint/performance/noAccumulatingSpread: <Needed to create data structure required for serviceWithSchema functions>
				...init,
				[curr.methodName]: curr,
			};
		},
		{} as { [K in keyof T]: MethodDetails },
	);
	const { implementation: zodImplementation, meta } = serviceWithSchema(
		implementation,
		{
			name: serviceName,
			methods: serviceMethods,
			logger,
		},
	);

	// biome-ignore lint/suspicious/noExplicitAny: Methods are defined by the user
	const methods: Record<string, Method<any, any>> = {};
	for (const [key, func] of Object.entries(zodImplementation)) {
		// biome-ignore lint/suspicious/noExplicitAny: Methods are defined by the user
		methods[key] = func as Method<any, any>;
	}

	return {
		meta: {
			service: serviceName,
			expose: meta.expose,
		},
		implementation: methods,
	};
}

// function serializeZodSchema(schema: z.ZodType<any, z.ZodTypeDef, any>): any {
// 	if (schema instanceof z.ZodObject) {
// 		const shape = schema.shape as Record<
// 			string,
// 			// biome-ignore lint/suspicious/noExplicitAny: Methods are defined by the user
// 			z.ZodType<any, z.ZodTypeDef, any>
// 		>;
// 		return {
// 			type: "object",
// 			properties: Object.fromEntries(
// 				Object.entries(shape).map(([key, value]) => [
// 					key,
// 					serializeZodSchema(value),
// 				]),
// 			),
// 		};
// 	}
// 	if (schema instanceof z.ZodOptional) {
// 		return {
// 			type: "optional",
// 			inner: serializeZodSchema(schema.unwrap()),
// 		};
// 	}
// 	if (schema instanceof z.ZodArray) {
// 		return {
// 			type: "array",
// 			items: serializeZodSchema(schema.element),
// 		};
// 	}
// 	if (schema instanceof z.ZodString) {
// 		return { type: "string" };
// 	}
// 	if (schema instanceof z.ZodNumber) {
// 		return { type: "number" };
// 	}
// 	if (schema instanceof z.ZodBoolean) {
// 		return { type: "boolean" };
// 	}
// 	if (schema instanceof z.ZodEnum) {
// 		return {
// 			type: "enum",
// 			values: schema.options,
// 		};
// 	}
// 	if (schema instanceof z.ZodUnion) {
// 		return {
// 			type: "union",
// 			options: schema.options.map(serializeZodSchema),
// 		};
// 	}
// 	if (schema instanceof z.ZodLiteral) {
// 		return {
// 			type: "literal",
// 			value: schema.value,
// 		};
// 	}
// 	if (schema instanceof z.ZodNullable) {
// 		return {
// 			type: "nullable",
// 			inner: serializeZodSchema(schema.unwrap()),
// 		};
// 	}
// 	if (schema instanceof z.ZodOptional) {
// 		return {
// 			type: "optional",
// 			inner: serializeZodSchema(schema.unwrap()),
// 		};
// 	}
// 	if (schema instanceof z.ZodDate) {
// 		return { type: "date" };
// 	}
// 	if (schema instanceof z.ZodVoid) {
// 		return { type: "void" };
// 	}
// 	if (schema instanceof z.ZodNull) {
// 		return { type: "null" };
// 	}
// 	return { type: "unknown" };
// }
