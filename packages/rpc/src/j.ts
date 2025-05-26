// j.ts - Fixed with proper type constraints

import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import type { Env, HTTPResponseError, MiddlewareHandler } from "hono/types";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodError, type ZodType } from "zod/v4";
import { mergeRouters } from "./merge-routers";
import { Procedure } from "./procedure";
import { Router } from "./router";
import type { MiddlewareFunction, OperationType } from "./types";

const router = <
	T extends Record<string, OperationType<ZodType | void, ZodType | void>>,
	E extends Env,
>(
	procedures: T = {} as T,
): Router<T, E> => {
	return new Router(procedures);
};

/**
 * Adapts a Hono middleware to be compatible with the type-safe middleware format
 */
export function fromHono<E extends Env = Env>(
	honoMiddleware: MiddlewareHandler<E>,
): MiddlewareFunction<Record<string, unknown>, void, E> {
	return async ({ c, next }) => {
		await honoMiddleware(c, async () => {
			const result = await next();
			return result;
		});
	};
}

class JStack {
	init<E extends Env = Env>() {
		return {
			/**
			 * Type-safe router factory function that creates a new router instance.
			 */
			router,
			mergeRouters,
			middleware: <T = Record<string, unknown>, R = void>(
				middleware: MiddlewareFunction<T, R, E>,
			): MiddlewareFunction<T, R, E> => middleware,
			fromHono,
			procedure: new Procedure<E>(),
			defaults: {
				/**
				 * CORS middleware configuration with default settings for API endpoints.
				 */
				cors: cors({
					allowHeaders: ["x-is-superjson", "Content-Type"],
					exposeHeaders: ["x-is-superjson"],
					origin: (origin) => origin,
					credentials: true,
				}),
				/**
				 * Global error handler for API endpoints.
				 */
				errorHandler: (err: Error | HTTPResponseError) => {
					console.error("[API Error]", err);

					if (err instanceof HTTPException) {
						return err.getResponse();
					}
					if (err instanceof ZodError) {
						const httpError = new HTTPException(422, {
							message: "Validation error",
							cause: err,
						});

						return httpError.getResponse();
					}
					if (
						err &&
						typeof err === "object" &&
						"status" in err &&
						typeof err.status === "number"
					) {
						const httpError = new HTTPException(
							err.status as ContentfulStatusCode,
							{
								message: err.message || "API Error",
								cause: err,
							},
						);

						return httpError.getResponse();
					}
					const httpError = new HTTPException(500, {
						message:
							"An unexpected error occurred. Check server logs for details.",
						cause: err,
					});

					return httpError.getResponse();
				},
			},
		};
	}
}

export const jstack = new JStack();
