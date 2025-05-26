import type superjson from "@squaredmade/superjson";
import type { Context, TypedResponse } from "hono";
import type { Env, Input } from "hono/types";
import type { StatusCode } from "hono/utils/http-status";
import type { ZodType } from "zod/v4";
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
	E extends Env = Env,
	P extends string = string,
	I extends Input = Input,
> = Context<E, P, I> & SuperJSONHandler;

export type InferMiddlewareOutput<T> = T extends MiddlewareFunction<
	unknown,
	infer R,
	Env
>
	? R
	: unknown;

export type MiddlewareFunction<
	T = Record<string, unknown>,
	R = void,
	E extends Env = Env,
> = (params: {
	ctx: T;
	next: <B extends Record<string, unknown>>(args?: B) => Promise<void>;
	c: ContextWithSuperJSON<E>;
}) => Promise<R>;

export type EmitFunction = (event: string, data?: unknown) => Promise<void>;

export type RoomEmitFunction = (room: string, data?: unknown) => Promise<void>;

export type WebSocketHandler<
	IncomingSchema extends ZodType | void,
	OutgoingSchema extends ZodType | void,
> = {
	onConnect?: ({
		socket,
	}: {
		socket:
			| ServerSocket<IncomingSchema | undefined, OutgoingSchema | undefined>
			| undefined;
	}) => unknown;
	onDisconnect?: ({
		socket,
	}: {
		socket: ServerSocket<
			IncomingSchema | undefined,
			OutgoingSchema | undefined
		>;
	}) => unknown;
	onError?: ({
		socket,
		error,
	}: {
		socket: ServerSocket<
			IncomingSchema | undefined,
			OutgoingSchema | undefined
		>;
		error: Event;
	}) => unknown;
};

export type WebSocketOperation<
	IncomingSchema extends ZodType | void,
	OutgoingSchema extends ZodType | void,
	E extends Env = Env,
> = {
	type: "ws";
	incoming?: IncomingSchema;
	outgoing?: OutgoingSchema;
	outputFormat: "ws";
	handler: <Input extends Record<string, unknown>>({
		io,
		c,
		ctx,
	}: {
		io: IO<IncomingSchema, OutgoingSchema>;
		c: ContextWithSuperJSON<E>;
		ctx: Input;
	}) => OptionalPromise<WebSocketHandler<IncomingSchema, OutgoingSchema>>;

	middlewares: MiddlewareFunction<Record<string, unknown>, unknown, E>[];
};

type OptionalPromise<T> = T | Promise<T>;

export type ResponseType<Output> =
	| SuperJSONTypedResponse<Output>
	| TypedResponse<Output, StatusCode, "text">
	| Response
	| void;

type UnwrapResponse<T> = Awaited<T> extends TypedResponse<infer U>
	? TypedResponse<U, StatusCode>
	: Awaited<T> extends SuperJSONTypedResponse<infer U>
		? SuperJSONTypedResponse<U>
		: Awaited<T> extends Response
			? Response
			: Awaited<T> extends void
				? Response
				: Awaited<T> extends ResponseType<infer U>
					? ResponseType<U>
					: Response;

export type GetOperation<
	Schema extends ZodType | void,
	Return = OptionalPromise<ResponseType<unknown>>,
	E extends Env = Env,
> = {
	type: "get";
	schema?: Schema extends void ? void : ZodType;
	handler: <Input extends Record<string, unknown>>({
		c,
		ctx,
		input,
	}: {
		ctx: Input;
		c: ContextWithSuperJSON<E>;
		input: Schema extends ZodType ? Schema : void;
	}) => Promise<UnwrapResponse<OptionalPromise<Return>>>;

	middlewares: MiddlewareFunction<Record<string, unknown>, unknown, E>[];
};

export type PostOperation<
	Schema extends ZodType | void,
	Return = OptionalPromise<ResponseType<unknown>>,
	E extends Env = Env,
> = {
	type: "post";
	schema?: Schema extends void ? void : ZodType;
	handler: <Input extends Record<string, unknown>>({
		ctx,
		c,
		input,
	}: {
		ctx: Input;
		c: ContextWithSuperJSON<E>;
		input: Schema extends ZodType ? Schema : void;
	}) => UnwrapResponse<OptionalPromise<Return>>;

	middlewares: MiddlewareFunction<Record<string, unknown>, unknown, E>[];
};

// Fixed: Allow void schemas
export type OperationType<
	I extends ZodType | void = ZodType | void,
	O extends ZodType | void = ZodType | void,
	E extends Env = Env,
> =
	| GetOperation<I, O, E>
	| PostOperation<I, O, E>
	| WebSocketOperation<I, O, E>;

export type InferInput<T> = T extends OperationType<infer I, ZodType | void>
	? I extends ZodType
		? I
		: void
	: void;
