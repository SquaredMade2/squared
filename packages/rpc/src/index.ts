import { randomBytes } from "node:crypto";
import * as context from "@squaredmade/context";
import type { Logger } from "@squaredmade/logger";
import superjson from "@squaredmade/superjson";
import type { MiddlewareHandler } from "hono";
import "tslib";
import { z } from "zod";
import {
	type Method,
	type MethodDetails,
	ResponseValidationError,
	type Service,
	type ServiceDetails,
	type ServiceSet,
	ValidationError,
	requestContexts,
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
): MiddlewareHandler {
	const postHandlers = new Map<string, MiddlewareHandler>();
	const getHandlers = new Map<string, MiddlewareHandler>();

	const meta = {
		services: Object.values(services.map((s) => getExposedMeta(s.meta))),
	};

	getHandlers.set("/", async (c) => {
		return c.json(meta);
	});

	for (const service of services) {
		const serviceName = service.meta.service;
		const serviceMeta = meta.services.find(
			(s) => s.serviceName === serviceName,
		);

		getHandlers.set(`/${serviceName}`, async (c) => {
			return c.json(serviceMeta);
		});

		for (const methodDef of service.meta.expose) {
			const { methodName } = methodDef;
			const methodMeta = serviceMeta?.interfaces.find(
				(s) => s.methodName === methodName,
			);

			const getHandler: MiddlewareHandler = async (c) => {
				return c.json(methodMeta);
			};
			getHandlers.set(`/${serviceName}/${methodName}`, getHandler);

			const methodFn = service.implementation[methodName].bind(
				service.implementation,
			);

			const postHandler: MiddlewareHandler = async (c) => {
				let abortable: context.Abortable | null = null;
				try {
					const requestDeadline = c.req.header("x-request-deadline");

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
							c.req.header("x-request-id") ||
							randomBytes(6).toString("base64url"),
					});

					// Store context for cleanup
					c.set("abortable", abortable);

					requestContexts.set(c.req.raw, ctx);
					const body = await c.req.json();
					const result = await methodFn(superjson.parse(JSON.stringify(body)));
					return c.json(superjson.stringify(result));

					// biome-ignore lint/suspicious/noExplicitAny: Error has to be any
				} catch (err: any) {
					throw new RpcError(serviceName, methodName, err);
				} finally {
					abortable?.abort();
				}
			};

			postHandlers.set(`/${serviceName}/${methodName}`, postHandler);
		}
	}

	return async (c, next) => {
		let handler: MiddlewareHandler | undefined;
		switch (c.req.method) {
			case "GET":
				handler = getHandlers.get(c.req.path);
				break;
			case "POST":
				handler = postHandlers.get(c.req.path);
				break;
		}

		if (!handler) {
			return next();
		}

		return handler(c, next);
	};
}

export function createErrorHandler(
	args: { log?: Logger } = {},
): MiddlewareHandler {
	const { log } = args;
	return async (c, next) => {
		try {
			return await next();
		} catch (err) {
			if (err instanceof RpcError) {
				const source = `${err.serviceName}/${err.methodName}`;
				log?.error(`Error executing ${source}: ${err.inner.stack}`);
				if (
					err.inner instanceof ValidationError ||
					err.inner instanceof ResponseValidationError
				) {
					return c.json(
						{
							message: err.inner.message,
							code: err.inner.code,
							type: err.inner.type,
							params: err.inner.params,
						},
						400,
					);
				}
				return c.json(
					{
						message: err.inner.message,
						code: err.inner.code || "unknown_error",
						type:
							err.inner.type ||
							"https://errors.squared.global/@squaredmade/rpc/unknown-error",
					},
					400,
				);
			}
			// biome-ignore lint/suspicious/noExplicitAny: Error can be any type
			const error = err as any;
			log?.error(`Internal error: ${error.stack || error.message}`);
			return c.json({ message: "Internal Server Error" }, 500);
		}
	};
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
		meta: {
			service: serviceName,
			expose,
		},
		implementation: methods,
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
			type: "object",
			properties: Object.fromEntries(
				Object.entries(shape).map(([key, value]) => [
					key,
					serializeZodSchema(value),
				]),
			),
		};
	}
	if (schema instanceof z.ZodOptional) {
		return {
			type: "optional",
			inner: serializeZodSchema(schema.unwrap()),
		};
	}
	if (schema instanceof z.ZodArray) {
		return {
			type: "array",
			items: serializeZodSchema(schema.element),
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
			type: "union",
			options: schema.options.map(serializeZodSchema),
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
			type: "nullable",
			inner: serializeZodSchema(schema.unwrap()),
		};
	}
	if (schema instanceof z.ZodOptional) {
		return {
			type: "optional",
			inner: serializeZodSchema(schema.unwrap()),
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
