// procedure.ts - Fixed with proper type constraints

import superjson from "@squaredmade/superjson";
import type { Env } from "hono/types";
import type { StatusCode } from "hono/utils/http-status";
import type { ZodType, ZodTypeAny, z } from "zod/v4";
import type { IO } from "./sockets";
import type {
	ContextWithSuperJSON,
	GetOperation,
	MiddlewareFunction,
	PostOperation,
	ResponseType,
	WebSocketHandler,
	WebSocketOperation,
} from "./types";

type OptionalPromise<T> = T | Promise<T>;
type InferIncomingData<Events> = Events extends ZodTypeAny
	? z.infer<Events>
	: void;

export class Procedure<
	E extends Env = Env,
	Ctx = Record<string, unknown>,
	InputSchema extends ZodType | void = void,
	Incoming extends ZodType | void = void,
	Outgoing extends ZodType | void = void,
> {
	private readonly middlewares: MiddlewareFunction<Ctx, void, E>[] = [];
	private readonly inputSchema?: InputSchema;
	private readonly incomingSchema?: Incoming;
	private readonly outgoingSchema?: Outgoing;

	private superjsonMiddleware: MiddlewareFunction<Ctx, void, E> =
		async function superjsonMiddleware({ c, next }) {
			type JSONRespond = typeof c.json;

			c.superjson = (<T>(data: T, status?: StatusCode): Response => {
				const serialized = superjson.stringify(data);

				return c.newResponse(serialized, status, {
					...Object.fromEntries(c.res.headers.entries()),
					"x-is-superjson": "true",
				});
			}) as JSONRespond;

			return next();
		};

	constructor(
		middlewares: MiddlewareFunction<Ctx, void, E>[] = [],
		inputSchema?: InputSchema,
		incomingSchema?: Incoming,
		outgoingSchema?: Outgoing,
	) {
		this.middlewares = middlewares;
		this.inputSchema = inputSchema;
		this.incomingSchema = incomingSchema;
		this.outgoingSchema = outgoingSchema;

		if (!this.middlewares.some((mw) => mw.name === "superjsonMiddleware")) {
			this.middlewares.push(this.superjsonMiddleware);
		}
	}

	/**
	 * Validates incoming WebSocket messages using a Zod schema.
	 */
	incoming<Schema extends ZodTypeAny>(schema: Schema) {
		return new Procedure<E, Ctx, InputSchema, Schema, Outgoing>(
			this.middlewares,
			this.inputSchema,
			schema,
			this.outgoingSchema,
		);
	}

	/**
	 * Validates outgoing WebSocket messages using a Zod schema.
	 */
	outgoing<Schema extends ZodTypeAny>(schema: Schema) {
		return new Procedure<E, Ctx, InputSchema, Incoming, Schema>(
			this.middlewares,
			this.inputSchema,
			this.incomingSchema,
			schema,
		);
	}

	/**
	 * Validates input parameters using a Zod schema.
	 */
	input<Schema extends ZodTypeAny>(schema: Schema) {
		return new Procedure<E, Ctx, Schema, Incoming, Outgoing>(
			this.middlewares,
			schema,
			this.incomingSchema,
			this.outgoingSchema,
		);
	}

	/**
	 * Adds a middleware function to the procedure chain.
	 */
	use<T extends Record<string, unknown>, Return = void>(
		handler: MiddlewareFunction<Ctx, Return, E>,
	): Procedure<E, Ctx & T & Return, InputSchema, Incoming, Outgoing> {
		return new Procedure<E, Ctx & T & Return, InputSchema, Incoming, Outgoing>(
			[...this.middlewares, handler as MiddlewareFunction<Ctx, void, E>],
			this.inputSchema,
			this.incomingSchema,
			this.outgoingSchema,
		);
	}

	get<Return extends OptionalPromise<ResponseType<unknown>>>(
		handler: ({
			ctx,
			c,
			input,
		}: {
			ctx: Ctx;
			c: ContextWithSuperJSON<E>;
			input: InputSchema extends ZodTypeAny ? z.infer<InputSchema> : void;
		}) => Return,
	): GetOperation<InputSchema, Return, E> {
		return {
			type: "get",
			schema: this.inputSchema as InputSchema extends void ? void : ZodType,
			handler: handler as GetOperation<InputSchema, Return, E>["handler"],
			middlewares: this.middlewares as MiddlewareFunction<
				Record<string, unknown>,
				unknown,
				E
			>[],
		};
	}

	query<Return extends OptionalPromise<ResponseType<unknown>>>(
		handler: ({
			ctx,
			c,
			input,
		}: {
			ctx: Ctx;
			c: ContextWithSuperJSON<E>;
			input: InputSchema extends ZodTypeAny ? z.infer<InputSchema> : void;
		}) => Return,
	): GetOperation<InputSchema, Return, E> {
		return this.get(handler);
	}

	post<Return extends OptionalPromise<ResponseType<unknown>>>(
		handler: ({
			ctx,
			c,
			input,
		}: {
			ctx: Ctx;
			c: ContextWithSuperJSON<E>;
			input: InputSchema extends ZodTypeAny ? z.infer<InputSchema> : void;
		}) => Return,
	): PostOperation<InputSchema, Return, E> {
		return {
			type: "post",
			schema: this.inputSchema as InputSchema extends void ? void : ZodType,
			handler: handler as PostOperation<InputSchema, Return, E>["handler"],
			middlewares: this.middlewares as MiddlewareFunction<
				Record<string, unknown>,
				unknown,
				E
			>[],
		};
	}

	mutation<Return extends OptionalPromise<ResponseType<unknown>>>(
		handler: ({
			ctx,
			c,
			input,
		}: {
			ctx: Ctx;
			c: ContextWithSuperJSON<E>;
			input: InputSchema extends ZodTypeAny ? z.infer<InputSchema> : void;
		}) => Return,
	): PostOperation<InputSchema, Return, E> {
		return this.post(handler);
	}

	ws(
		handler: ({
			io,
			c,
			ctx,
		}: {
			io: IO<InferIncomingData<Incoming>, InferIncomingData<Outgoing>>;
			c: ContextWithSuperJSON<E>;
			ctx: Ctx;
		}) => OptionalPromise<
			WebSocketHandler<InferIncomingData<Incoming>, InferIncomingData<Outgoing>>
		>,
	): WebSocketOperation<
		InferIncomingData<Incoming>,
		InferIncomingData<Outgoing>,
		E
	> {
		return {
			type: "ws",
			outputFormat: "ws",
			handler: handler as WebSocketOperation<
				InferIncomingData<Incoming>,
				InferIncomingData<Outgoing>,
				E
			>["handler"],
			middlewares: this.middlewares as MiddlewareFunction<
				Record<string, unknown>,
				unknown,
				E
			>[],
		};
	}
}
