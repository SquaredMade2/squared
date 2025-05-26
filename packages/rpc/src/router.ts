import createCustomLogger from "@squaredmade/logger";
import { type Context, Hono, type Next } from "hono";
import { env } from "hono/adapter";
import { HTTPException } from "hono/http-exception";
import type { Env, ErrorHandler, MiddlewareHandler } from "hono/types";
import type { StatusCode } from "hono/utils/http-status";
import { z } from "zod/v4";
import type { ZodObject, ZodType } from "zod/v4";
import { bodyParsingMiddleware, queryParsingMiddleware } from "./middleware";
import { IO, ServerSocket } from "./sockets";
import type {
	ContextWithSuperJSON,
	GetOperation,
	InferInput,
	OperationType,
	PostOperation,
	RouterConfig,
	WebSocketOperation,
} from "./types";

const logger = createCustomLogger("rpc-router");

type FlattenRoutes<T> = {
	[K in keyof T]: T[K] extends WebSocketOperation<ZodObject, ZodObject>
		? { [P in `${string & K}`]: T[K] }
		: T[K] extends GetOperation<ZodType | void>
			? { [P in `${string & K}`]: T[K] }
			: T[K] extends PostOperation<ZodType | void>
				? { [P in `${string & K}`]: T[K] }
				: T[K] extends Record<string, unknown>
					? {
							[SubKey in keyof T[K] as `${string & K}/${string &
								SubKey}`]: T[K][SubKey] extends
								| WebSocketOperation<ZodObject, ZodObject>
								| GetOperation<ZodType | void>
								| PostOperation<ZodType | void>
								? T[K][SubKey]
								: never;
						}
					: never;
}[keyof T];

export type MergeRoutes<T> = {
	[K in keyof FlattenRoutes<T>]: FlattenRoutes<T>[K];
};

export type RouterSchema<T extends Record<string, unknown>> = {
	[K in keyof T]: T[K] extends WebSocketOperation<ZodObject, ZodObject>
		? {
				$get: {
					input: InferInput<T[K]>;
					output: Record<string, never>;
					incoming: NonNullable<T[K]["incoming"]>;
					outgoing: NonNullable<T[K]["outgoing"]>;
					outputFormat: "ws";
					status: StatusCode;
				};
			}
		: T[K] extends GetOperation<ZodType | void>
			? {
					$get: {
						input: InferInput<T[K]>;
						output: ReturnType<T[K]["handler"]>;
						outputFormat: "json";
						status: StatusCode;
					};
				}
			: T[K] extends PostOperation<ZodType | void>
				? {
						$post: {
							input: InferInput<T[K]>;
							output: ReturnType<T[K]["handler"]>;
							outputFormat: "json";
							status: StatusCode;
						};
					}
				: never;
};

export type OperationSchema<T> = T extends WebSocketOperation<
	ZodObject,
	ZodObject
>
	? {
			$get: {
				input: InferInput<T>;
				output: Record<string, never>;
				incoming: NonNullable<T["incoming"]>;
				outgoing: NonNullable<T["outgoing"]>;
				outputFormat: "ws";
				status: StatusCode;
			};
		}
	: T extends GetOperation<ZodType | void>
		? {
				$get: {
					input: InferInput<T>;
					output: ReturnType<T["handler"]>;
					outputFormat: "json";
					status: StatusCode;
				};
			}
		: T extends PostOperation<ZodType | void>
			? {
					$post: {
						input: InferInput<T>;
						output: ReturnType<T["handler"]>;
						outputFormat: "json";
						status: StatusCode;
					};
				}
			: never;

interface InternalContext {
	__middleware_output?: Record<string, unknown>;
	__parsed_query?: Record<string, unknown>;
	__parsed_body?: Record<string, unknown>;
}

// Type for WebSocket bindings
interface WebSocketBindings {
	UPSTASH_REDIS_REST_URL: string | undefined;
	UPSTASH_REDIS_REST_TOKEN: string | undefined;
}

// Type for sub-router storage
type SubRouterValue<
	TRouter = Router<
		Record<
			string,
			Record<string, unknown> | OperationType<ZodObject, ZodObject>
		>
	>,
> = Promise<TRouter> | TRouter;

// Type for procedures metadata
type ProcedureMetadata = Record<string, { type: "get" | "post" | "ws" }>;

export class Router<
	T extends Record<
		string,
		OperationType<ZodObject | void, ZodObject | void> | Record<string, unknown>
	> = Record<string, never>,
	E extends Env = Env,
> extends Hono<E, RouterSchema<MergeRoutes<T>>, string> {
	_metadata: {
		subRouters: Record<string, SubRouterValue>;
		config: RouterConfig | Record<string, RouterConfig>;
		procedures: Record<string, ProcedureMetadata>;
		registeredPaths: string[];
	};

	_errorHandler: ErrorHandler<E> | undefined = undefined;

	config(config?: RouterConfig) {
		if (config) {
			this._metadata.config = config;
		}

		return this;
	}

	// Used in Hono adapters
	// Strips types to prevent version-mismatch induced infinite recursion warning
	get handler(): Hono<E> {
		return this as unknown as Hono<E>;
	}

	constructor(procedures: T = {} as T) {
		super();

		this._metadata = {
			subRouters: {},
			config: {},
			procedures: {},
			registeredPaths: [],
		};

		this.onError = (handler: ErrorHandler<E>) => {
			this._errorHandler = handler;
			return this;
		};

		this.setupRoutes(procedures);
	}

	registerSubrouterMiddleware() {
		this.use(async (c, next) => {
			const [basePath, routerName] = c.req.path
				.split("/")
				.filter(Boolean)
				.slice(0, 2);

			const key = `/${basePath}/${routerName}`;
			const subRouter = await this._metadata.subRouters[key];

			if (subRouter) {
				const rewrittenPath = `/${c.req.path.split("/").slice(3).join("/")}`;
				const newUrl = new URL(c.req.url);
				newUrl.pathname = rewrittenPath;

				const newRequest = new Request(newUrl, c.req.raw);
				const response = await subRouter.fetch(newRequest, c.env);

				return response;
			}

			return next();
		});
	}

	private setupRoutes(procedures: Record<string, unknown>) {
		for (const [key, value] of Object.entries(procedures)) {
			if (this.isOperationType(value)) {
				this.registerOperation(key, value);
			} else if (typeof value === "object" && value !== null) {
				const nestedProcedures = value as Record<string, unknown>;
				for (const [subKey, subValue] of Object.entries(nestedProcedures)) {
					if (this.isOperationType(subValue)) {
						this.registerOperation(`${key}/${subKey}`, subValue);
					}
				}
			}
		}
	}

	private isOperationType(
		value: unknown,
	): value is OperationType<ZodObject | void, ZodObject | void, E> {
		return (
			value !== null &&
			typeof value === "object" &&
			"type" in value &&
			typeof (value as { type: unknown }).type === "string" &&
			["get", "post", "ws"].includes((value as { type: string }).type)
		);
	}

	private registerOperation(
		path: string,
		operation: OperationType<ZodObject | void, ZodObject | void, E>,
	) {
		const routePath = `/${path}` as const;

		if (!this._metadata.procedures[path]) {
			this._metadata.procedures[path] = {
				type: operation,
			};
		}

		const operationMiddlewares: MiddlewareHandler<E>[] =
			operation.middlewares.map((middleware) => {
				const middlewareHandler = async (c: Context<E>, next: Next) => {
					const typedC = c as ContextWithSuperJSON<
						E & { Variables: InternalContext }
					>;
					const middlewareOutput = typedC.get("__middleware_output") ?? {};

					const nextWrapper = async <B extends Record<string, unknown>>(
						args?: B,
					): Promise<void> => {
						if (args) {
							Object.assign(middlewareOutput, args);
						}
						return;
					};

					const res = await middleware({
						ctx: middlewareOutput,
						next: nextWrapper,
						c: c as ContextWithSuperJSON<E>,
					});

					if (res && typeof res === "object") {
						Object.assign(middlewareOutput, res);
					}

					typedC.set("__middleware_output", middlewareOutput);
					await next();
				};

				return middlewareHandler;
			});

		if (operation.type === "get") {
			const getOp = operation as GetOperation<ZodType | void, unknown, E>;

			if (getOp.schema) {
				this.get(
					routePath,
					queryParsingMiddleware,
					...operationMiddlewares,
					async (c) => {
						const typedC = c as Context<E & { Variables: InternalContext }>;
						const ctx = typedC.get("__middleware_output") || {};
						const parsedQuery = typedC.get("__parsed_query");

						const queryInput =
							parsedQuery && Object.keys(parsedQuery).length > 0
								? parsedQuery
								: undefined;

						// caught at app-level with .onError
						const input = getOp.schema?.parse(queryInput) as ZodType;
						const result = await getOp.handler({
							c: c as ContextWithSuperJSON<E>,
							ctx,
							input,
						});

						return result === undefined ? c.json(undefined) : result;
					},
				);
			} else {
				this.get(routePath, ...operationMiddlewares, async (c) => {
					const typedC = c as Context<E & { Variables: InternalContext }>;
					const ctx = typedC.get("__middleware_output") || {};

					const result = await getOp.handler({
						c: c as ContextWithSuperJSON<E>,
						ctx,
						input: undefined as void,
					});
					return result === undefined ? c.json(undefined) : result;
				});
			}
		} else if (operation.type === "post") {
			const postOp = operation as PostOperation<ZodType | void, unknown, E>;

			if (postOp.schema) {
				this.post(
					routePath,
					bodyParsingMiddleware,
					...operationMiddlewares,
					async (c) => {
						const typedC = c as Context<E & { Variables: InternalContext }>;
						const ctx = typedC.get("__middleware_output") || {};
						const parsedBody = typedC.get("__parsed_body");

						const bodyInput =
							parsedBody && Object.keys(parsedBody).length > 0
								? parsedBody
								: undefined;

						// caught at app-level with .onError
						const input = postOp.schema?.parse(bodyInput);

						const result = await postOp.handler({
							c: c as ContextWithSuperJSON<E>,
							ctx,
							input: input as ZodType | void,
						});

						return result === undefined ? c.json(undefined) : result;
					},
				);
			} else {
				this.post(routePath, ...operationMiddlewares, async (c) => {
					const typedC = c as Context<E & { Variables: InternalContext }>;
					const ctx = typedC.get("__middleware_output") || {};

					const result = await postOp.handler({
						c: c as ContextWithSuperJSON<E>,
						ctx,
						input: undefined as void,
					});
					return result === undefined ? c.json(undefined) : result;
				});
			}
		} else if (operation.type === "ws") {
			const wsOp = operation;

			this.get(
				routePath,
				queryParsingMiddleware,
				...operationMiddlewares,
				async (c) => {
					const typedC = c as Context<
						E & {
							Variables: InternalContext;
							Bindings: WebSocketBindings;
						}
					>;

					const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } =
						env(typedC);

					if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
						throw new HTTPException(503, {
							message:
								"Missing required environment variables for WebSockets connection.\n\n" +
								"Real-time WebSockets depend on a persistent connection layer to maintain communication. JStack uses Upstash Redis to achieve this." +
								"To fix this error:\n" +
								"1. Log in to Upstash Redis at https://upstash.com\n" +
								"2. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to your environment variables\n\n" +
								"Complete WebSockets guide: https://jstack.app/docs/websockets\n",
						});
					}

					const ctx = typedC.get("__middleware_output") || {};

					const { 0: client, 1: server } = new WebSocketPair();

					server.accept();

					const io = new IO(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN);

					const handler = await wsOp.handler({
						io,
						c: c as ContextWithSuperJSON<E>,
						ctx,
					});

					const socket = new ServerSocket<
						typeof wsOp.incoming,
						typeof wsOp.outgoing
					>(server, {
						redisUrl: UPSTASH_REDIS_REST_URL,
						redisToken: UPSTASH_REDIS_REST_TOKEN,
						incomingSchema: wsOp.incoming,
						outgoingSchema: wsOp.outgoing,
					});

					handler.onConnect?.({ socket });

					server.onclose = async () => {
						socket.close();
						await handler.onDisconnect?.({ socket });
					};

					server.onerror = async (error) => {
						socket.close();
						await handler.onError?.({ socket, error });
					};

					const eventSchema = z.tuple([z.string(), z.unknown()]);
					server.onmessage = async (event) => {
						try {
							const rawData = z.string().parse(event.data);
							const parsedData = JSON.parse(rawData) as unknown;

							const [eventName, eventData] = eventSchema.parse(parsedData);

							if (eventName === "ping") {
								server.send(JSON.stringify(["pong", null]));
								return;
							}

							socket.handleEvent(eventName, eventData);
						} catch (err) {
							logger.error("Failed to process message:", err);
						}
					};

					return new Response(null, {
						status: 101,
						webSocket: client,
					});
				},
			);
		}
	}
}
