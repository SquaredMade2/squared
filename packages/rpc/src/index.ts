import { randomBytes } from "node:crypto";
import type { Abortable } from "@squaredmade/context";
import {
	background,
	requestIdKey,
	withAbort,
	withDeadline,
	withValues,
} from "@squaredmade/context";
import type { Logger } from "@squaredmade/logger";
import superjson from "@squaredmade/superjson";
import type { ErrorRequestHandler, RequestHandler } from "express";
import "tslib";
import { z } from "zod";
import {
	type Method,
	type MethodDetails,
	ResponseValidationError,
	requestContexts,
	type Service,
	type ServiceDetails,
	type ServiceSet,
	ValidationError,
} from "./rpc-types";

export type {
	ContextMethod,
	ContextMethods,
	ContextService,
	Method,
	MethodDetails,
	Methods,
	Service,
	ServiceDetails,
	ServiceSet,
} from "./rpc-types";
export {
	contextServiceWithSchema,
	errorMessage,
	ResponseValidationError,
	requestContexts,
	serviceWithSchema,
	ValidationError,
	voidSchema,
} from "./rpc-types";

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
		help: serviceDetails.help || `${serviceDetails.service} service`,
		interfaces: serviceDetails.expose.map((method: MethodDetails) => {
			const {
				methodName,
				methodTimeout = 60_000,
				help,
				paramNames = [],
				requestSchema,
				responseSchema,
			} = method;

			return {
				help: help || `${methodName} method`,
				methodName,
				methodTimeout,
				paramNames,
				requestSchema,
				responseSchema,
			};
		}),
		multiArg: false,
		serviceName: serviceDetails.service,
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
				let abortable: Abortable | null = null;
				try {
					const requestDeadline = first(req.headers["x-request-deadline"]);

					if (requestDeadline) {
						abortable = withDeadline(background, Date.parse(requestDeadline));
					} else {
						abortable = withAbort(background);
					}

					const ctx = withValues(abortable.ctx, {
						[requestIdKey]:
							first(req.headers["x-request-id"]) ||
							randomBytes(6).toString("base64url"),
					});

					res.on("finish", () => abortable?.abort());

					requestContexts.set(req, ctx);
					const result = await methodFn(
						superjson.parse(JSON.stringify(req.body)),
					);
					res.json(superjson.stringify(result));

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
					code: err.inner.code,
					message: err.inner.message,
					params: err.inner.params,
					type: err.inner.type,
				});
			} else {
				res.status(400).json({
					code: err.inner.code || "unknown_error",
					message: err.inner.message,
					type:
						err.inner.type ||
						"https://errors.squared.global/@squaredmade/rpc/unknown-error",
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

export function createSchema<T>() {
	return <
		S extends z.ZodType<T> & z.ZodObject<{ [K in keyof T]: z.ZodTypeAny }>,
	>(
		schema: S,
	): S => schema;
}

export function createEnumSchema<T extends string>() {
	return <S extends z.ZodEnum<[T, ...T[]]>>(schema: S): S => schema;
}

export function createServiceSchema<T>() {
	// Define the structure expected for each method in the schema
	type ServiceDefinition = {
		[K in keyof T]: T[K] extends (arg: infer Input) => Promise<infer Output>
			? { input: z.ZodType<Input>; output: z.ZodType<Output> }
			: never;
	};

	// Accept the schema argument and enforce the structure with ServiceDefinition
	return <S extends ServiceDefinition>(schema: S): S => schema;
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
): ServiceSet<Service> {
	const expose: MethodDetails[] = Object.entries(schema).map(
		([methodName, { input, output }]) => ({
			methodName,
			requestSchema: serializeZodSchema(input),
			responseSchema: serializeZodSchema(output),
		}),
	);

	// biome-ignore lint/suspicious/noExplicitAny: Methods are defined by the user
	const methods: Record<string, Method<any, any>> = {};
	for (const [key, func] of Object.entries(implementation)) {
		// biome-ignore lint/suspicious/noExplicitAny: Methods are defined by the user
		methods[key] = func as Method<any, any>;
	}

	return {
		implementation: methods,
		meta: {
			expose,
			service: serviceName,
		},
	};
}

// biome-ignore lint/suspicious/noExplicitAny: Methods are defined by the user
function serializeZodSchema(schema: z.ZodType<any, z.ZodTypeDef, any>): any {
	if (schema instanceof z.ZodObject) {
		const shape = schema.shape as Record<
			string,
			// biome-ignore lint/suspicious/noExplicitAny: Methods are defined by the user
			z.ZodType<any, z.ZodTypeDef, any>
		>;
		return {
			properties: Object.fromEntries(
				Object.entries(shape).map(([key, value]) => [
					key,
					serializeZodSchema(value),
				]),
			),
			type: "object",
		};
	}
	if (schema instanceof z.ZodOptional) {
		return {
			inner: serializeZodSchema(schema.unwrap()),
			type: "optional",
		};
	}
	if (schema instanceof z.ZodArray) {
		return {
			items: serializeZodSchema(schema.element),
			type: "array",
		};
	}
	if (schema instanceof z.ZodString) {
		return { type: "string" };
	}
	if (schema instanceof z.ZodNumber) {
		return { type: "number" };
	}
	if (schema instanceof z.ZodBoolean) {
		return { type: "boolean" };
	}
	if (schema instanceof z.ZodEnum) {
		return {
			type: "enum",
			values: schema.options,
		};
	}
	if (schema instanceof z.ZodUnion) {
		return {
			options: schema.options.map(serializeZodSchema),
			type: "union",
		};
	}
	if (schema instanceof z.ZodLiteral) {
		return {
			type: "literal",
			value: schema.value,
		};
	}
	if (schema instanceof z.ZodNullable) {
		return {
			inner: serializeZodSchema(schema.unwrap()),
			type: "nullable",
		};
	}
	if (schema instanceof z.ZodOptional) {
		return {
			inner: serializeZodSchema(schema.unwrap()),
			type: "optional",
		};
	}
	if (schema instanceof z.ZodDate) {
		return { type: "date" };
	}
	if (schema instanceof z.ZodVoid) {
		return { type: "void" };
	}
	if (schema instanceof z.ZodNull) {
		return { type: "null" };
	}
	if (schema instanceof z.ZodUndefined) {
		return { type: "undefined" };
	}
	return { type: "unknown" };
}
