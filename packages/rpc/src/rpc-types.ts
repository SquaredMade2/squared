import type { Context } from "@squaredmade/context";
import type { Logger } from "@squaredmade/logger";
import { z } from "zod";

export const requestContexts = new WeakMap<object, Context>();

// biome-ignore lint/suspicious/noExplicitAny: Methods are defined by the user
export type Method<A = any, R = any> = (args: A) => R;
// biome-ignore lint/suspicious/noExplicitAny: Methods are defined by the user
export type ContextMethod<A = any, R = any> = (ctx: Context, args: A) => R;

// biome-ignore lint/suspicious/noExplicitAny: Methods are defined by the user
export interface MethodDetails<Req = any, Res = any> {
	methodName: string;
	methodTimeout?: number;
	help?: string;
	paramNames?: string[];
	requestSchema: z.ZodType<Req>;
	responseSchema: z.ZodType<Res>;
}

export interface ServiceDetails {
	expose: MethodDetails[];
	service: string;
	help?: string;
	path?: string;
}

export interface Service {
	[methodName: string]: Method;
}

export interface ContextService {
	[methodName: string]: ContextMethod;
}

export interface ServiceSet<S extends Service> {
	implementation: S;
	meta: ServiceDetails;
}

export const voidSchema = z.void();

export class ValidationError extends Error {
	code: string;
	type: string;
	params: { instancePath?: string; schemaPath?: string };

	constructor(
		code: string,
		type: string,
		message: string,
		params: { instancePath?: string; schemaPath?: string },
	) {
		super(message);
		this.name = "ValidationError";
		this.code = code;
		this.type = type;
		this.params = params;
		Object.setPrototypeOf(this, ValidationError.prototype);
	}
}

export class ResponseValidationError extends ValidationError {
	constructor(
		message: string,
		params: { instancePath?: string; schemaPath?: string },
	) {
		super(
			"response-validation",
			"https://errors.squared.global/@squaredmade/rpc/response-validation",
			message,
			params,
		);
		this.name = "ResponseValidationError";
		Object.setPrototypeOf(this, ResponseValidationError.prototype);
	}
}

export type Methods<S extends Service> = {
	[K in keyof S]: MethodDetails<Parameters<S[K]>[0], Awaited<ReturnType<S[K]>>>;
};

export type ContextMethods<S extends ContextService> = {
	[K in keyof S]: MethodDetails<Parameters<S[K]>[1], Awaited<ReturnType<S[K]>>>;
};

export function contextServiceWithSchema<S extends ContextService>(
	service: S,
	serviceMeta: {
		name: string;
		methods: ContextMethods<S>;
		logger: Logger;
		strictResponseValidation?: boolean;
	},
): ServiceSet<Service> {
	const wrappedService: Service = {};

	for (const methodName of Object.keys(serviceMeta.methods)) {
		wrappedService[methodName] = async (args: unknown) => {
			const ctx = requestContexts.get(args as object);
			if (!ctx) {
				throw new Error("missing request context");
			}

			return await service[methodName](ctx, args);
		};
	}

	return serviceWithSchema(wrappedService, serviceMeta);
}

export function serviceWithSchema<S extends Service>(
	service: S,
	serviceMeta: {
		name: string;
		methods: Methods<S>;
		logger: Logger;
		strictResponseValidation?: boolean;
	},
): ServiceSet<S> {
	const implementation: {
		[K in keyof S]: S[K];
	} = {} as { [K in keyof S]: S[K] };

	const serviceDetails: ServiceDetails = {
		expose: [],
		service: serviceMeta.name,
	};

	const {
		logger,
		// biome-ignore lint/style/noProcessEnv: We need to check the environment
		strictResponseValidation = process.env.NODE_ENV !== "production",
	} = serviceMeta;

	for (const [methodName, methodMeta] of Object.entries(serviceMeta.methods)) {
		serviceDetails.expose.push({
			help: methodMeta.help,
			methodName,
			methodTimeout: methodMeta.methodTimeout,
			paramNames: methodMeta.paramNames,
			requestSchema: methodMeta.requestSchema,
			responseSchema: methodMeta.responseSchema,
		});

		const endpoint = service[methodName].bind(service);

		implementation[methodName as keyof S] = (async (args: unknown) => {
			try {
				const validatedArgs = methodMeta.requestSchema.parse(args);
				const result = await endpoint(validatedArgs);
				const validatedResult = methodMeta.responseSchema.parse(result);
				return validatedResult;
			} catch (error) {
				if (error instanceof z.ZodError) {
					const firstError = error.errors[0];
					const params = {
						instancePath: firstError.path.join("."),
						schemaPath: firstError.code,
					};
					if (
						error.name === "ZodError" &&
						error.errors[0].code === "invalid_type" &&
						error.errors[0].received === "undefined"
					) {
						throw new ResponseValidationError(
							"response schema validation error",
							params,
						);
					}
					throw new ValidationError(
						"validation",
						"https://errors.squared.global/@squaredmade/rpc/validation",
						`${params.instancePath} ${firstError.message}`,
						params,
					);
				}
				throw error;
			}
		}) as S[keyof S];
	}

	if (strictResponseValidation) {
		logger.error("Strict response validation is enabled");
	}

	return {
		implementation,
		meta: serviceDetails,
	};
}

export function errorMessage(err: z.ZodError): string {
	const firstError = err.errors[0];
	return `${firstError.path.join(".")} ${firstError.message}`;
}
