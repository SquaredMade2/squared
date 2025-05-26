import type superjson from "@squaredmade/superjson";
import type { Context, TypedResponse } from "hono";
import type { Env, Input } from "hono/types";
import type { StatusCode } from "hono/utils/http-status";
import type { z } from "zod";
import type { IO, ServerSocket } from "./sockets";

type SuperJSONParsedType<T> = ReturnType<typeof superjson.parse<T>>;

export type SuperJSONTypedResponse<
	T,
	U extends StatusCode = StatusCode,
> = TypedResponse<SuperJSONParsedType<T>, U, "json">;

export interface RouterConfig {
	name?: string;
}

export type SuperJSONHandler = {
	superjson: <T>(data: T, status?: number) => SuperJSONTypedResponse<T>;
};

export type ContextWithSuperJSON<
	// biome-ignore lint/suspicious/noExplicitAny: Hono framework requires any for generic environment and path parameters
	E extends Env = any,
	// biome-ignore lint/suspicious/noExplicitAny: Hono framework requires any for generic path parameters
	P extends string = any,
	I extends Input = {},
> = Context<E, P, I> & SuperJSONHandler;

export type InferMiddlewareOutput<T> = T extends MiddlewareFunction<
	// biome-ignore lint/suspicious/noExplicitAny: Generic inference requires any for unknown context types
	any,
	infer R,
	// biome-ignore lint/suspicious/noExplicitAny: Generic inference requires any for unknown environment types
	any
>
	? R
	: unknown;

export type MiddlewareFunction<
	T = {},
	R = void,
	// biome-ignore lint/suspicious/noExplicitAny: Hono framework requires any for generic environment parameters
	E extends Env = any,
> = (params: {
	ctx: T;
	next: <B>(args?: B) => Promise<B & T>;
	c: ContextWithSuperJSON<E>;
}) => Promise<R>;

// biome-ignore lint/suspicious/noExplicitAny: WebSocket events can contain any data structure
export type EmitFunction = (event: string, data?: any) => Promise<void>;
// biome-ignore lint/suspicious/noExplicitAny: WebSocket events can contain any data structure
export type RoomEmitFunction = (room: string, data?: any) => Promise<void>;

export type WebSocketHandler<IncomingSchema, OutgoingSchema> = {
	onConnect?: ({
		socket,
	}: {
		socket: ServerSocket<IncomingSchema, OutgoingSchema>;
		// biome-ignore lint/suspicious/noExplicitAny: WebSocket handler return types can be any value or void
	}) => any;
	onDisconnect?: ({
		socket,
	}: {
		socket: ServerSocket<IncomingSchema, OutgoingSchema>;
		// biome-ignore lint/suspicious/noExplicitAny: WebSocket handler return types can be any value or void
	}) => any;
	onError?: ({
		socket,
		error,
	}: {
		socket: ServerSocket<IncomingSchema, OutgoingSchema>;
		error: Event;
		// biome-ignore lint/suspicious/noExplicitAny: WebSocket handler return types can be any value or void
	}) => any;
};

export type WebSocketOperation<
	// biome-ignore lint/suspicious/noExplicitAny: WebSocket schemas require any for flexible event data structures
	IncomingSchema extends Record<string, any>,
	// biome-ignore lint/suspicious/noExplicitAny: WebSocket schemas require any for flexible event data structures
	OutgoingSchema extends Record<string, any>,
	// biome-ignore lint/suspicious/noExplicitAny: Hono framework requires any for generic environment parameters
	E extends Env = any,
> = {
	type: "ws";
	incoming?: IncomingSchema;
	outgoing?: OutgoingSchema;
	outputFormat: "ws";
	handler: <Input>({
		io,
		c,
		ctx,
	}: {
		io: IO<IncomingSchema, OutgoingSchema>;
		c: ContextWithSuperJSON<E>;
		ctx: Input;
	}) => OptionalPromise<WebSocketHandler<IncomingSchema, OutgoingSchema>>;
	// biome-ignore lint/suspicious/noExplicitAny: Middleware functions can accept any context and return any value
	middlewares: MiddlewareFunction<any, any, E>[];
};

export type ResponseType<Output> =
	| SuperJSONTypedResponse<Output>
	| TypedResponse<Output, StatusCode, "text">
	| Response
	| void;

type UnwrapResponse<T> = Awaited<T> extends TypedResponse<infer U>
	? U
	: Awaited<T> extends SuperJSONTypedResponse<infer U>
		? U
		: Awaited<T> extends Response
			? // biome-ignore lint/suspicious/noExplicitAny: Raw Response objects can contain any data structure
				any
			: Awaited<T> extends void
				? void
				: T;

export type GetOperation<
	// biome-ignore lint/suspicious/noExplicitAny: Schema can be any object structure for flexible input validation
	Schema extends Record<string, any> | void,
	// biome-ignore lint/suspicious/noExplicitAny: Return type can be any response structure
	Return = OptionalPromise<ResponseType<any>>,
	// biome-ignore lint/suspicious/noExplicitAny: Hono framework requires any for generic environment parameters
	E extends Env = any,
> = {
	type: "get";
	schema?: z.ZodType<Schema> | void;
	handler: <Input>({
		c,
		ctx,
		input,
	}: {
		ctx: Input;
		c: ContextWithSuperJSON<E>;
		// biome-ignore lint/suspicious/noExplicitAny: Input schema can be any object structure for flexible validation
		input: Schema extends Record<string, any> ? Schema : void;
	}) => UnwrapResponse<OptionalPromise<Return>>;
	// biome-ignore lint/suspicious/noExplicitAny: Middleware functions can accept any context and return any value
	middlewares: MiddlewareFunction<any, any, E>[];
};

type OptionalPromise<T> = T | Promise<T>;

export type PostOperation<
	// biome-ignore lint/suspicious/noExplicitAny: Schema can be any object structure for flexible input validation
	Schema extends Record<string, any> | void,
	// biome-ignore lint/suspicious/noExplicitAny: Return type can be any response structure
	Return = OptionalPromise<ResponseType<any>>,
	// biome-ignore lint/suspicious/noExplicitAny: Hono framework requires any for generic environment parameters
	E extends Env = any,
> = {
	type: "post";
	schema?: z.ZodType<Schema> | void;
	handler: <Input>({
		ctx,
		c,
	}: {
		ctx: Input;
		c: ContextWithSuperJSON<E>;
		// biome-ignore lint/suspicious/noExplicitAny: Input schema can be any object structure for flexible validation
		input: Schema extends Record<string, any> ? Schema : void;
	}) => UnwrapResponse<OptionalPromise<Return>>;
	// biome-ignore lint/suspicious/noExplicitAny: Middleware functions can accept any context and return any value
	middlewares: MiddlewareFunction<any, any, E>[];
};

export type OperationType<
	// biome-ignore lint/suspicious/noExplicitAny: Input can be any object structure for flexible operation parameters
	I extends Record<string, any>,
	O extends Record<string, unknown>,
	// biome-ignore lint/suspicious/noExplicitAny: Hono framework requires any for generic environment parameters
	E extends Env = any,
> =
	| GetOperation<I, O, E>
	| PostOperation<I, O, E>
	| WebSocketOperation<I, O, E>;

// biome-ignore lint/suspicious/noExplicitAny: Generic inference requires any for unknown output types
export type InferInput<T> = T extends OperationType<infer I, any>
	? I extends z.ZodTypeAny
		? z.infer<I>
		: I
	: void;
