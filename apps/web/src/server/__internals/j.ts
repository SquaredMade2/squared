import type { Context } from "hono";
import type { Bindings } from "../env";
import { Procedure } from "./procedure";

const baseProcedure = new Procedure();

// biome-ignore lint/complexity/noBannedTypes: This is a helper function
type MiddlewareFunction<T = {}, R = void> = (params: {
	ctx: T;
	next: <B>(args: B) => Promise<B & T>;
	c: Context<{ Bindings: Bindings }>;
}) => Promise<R>;

/**
 * A helper to easily define middlewares and new procedures
 */

export const j = {
	// biome-ignore lint/complexity/noBannedTypes: This is a helper function
	middleware: <T = {}, R = void>(
		fn: MiddlewareFunction<T, R>,
	): MiddlewareFunction<T, R> => {
		return fn;
	},
	procedure: baseProcedure,
};
