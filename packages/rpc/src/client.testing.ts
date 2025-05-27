import type { Hono } from "hono";
import type { Env } from "hono/types";
import type { StatusCode } from "hono/utils/http-status";
import { type ZodObject, z } from "zod/v4";
import {
	type ClientRequest,
	type MergeRoutes,
	type OperationSchema,
	type OperationType,
	type Router,
	type RouterSchema,
	sqStack,
} from ".";
import type { InferSchemaFromRouters } from "./merge-routers";

// Mock types for testing
interface AppEnv {
	Bindings: { DATABASE_URL: string };
}

const j = sqStack.init<AppEnv>();
const api = j
	.router()
	.basePath("/api")
	.use(j.defaults.cors)
	.onError(j.defaults.errorHandler);

const authRouter = j.router({
	test1: j.procedure.get(({ c }) => c.json({ message: "test" })),
	test2: j.procedure
		.input(
			z.object({
				name: z.string(),
			}),
		)
		.get(({ c, input }) => c.json({ message: `Hello ${input.name}` })),
});

const appRouter = j.mergeRouters(api, {
	auth: authRouter,
});

type TestAppRouter = typeof appRouter;

// =============================================================================
// STEP 1: Test Router Schema Extraction
// =============================================================================
type RouterRecord = Record<
	string,
	OperationType<ZodObject, ZodObject> | Record<string, unknown>
>;
type InferRouterEnv<T> = T extends Router<RouterRecord, infer E> ? E : never;

type Client<
	T extends
		| Router<RouterRecord, InferRouterEnv<T>>
		| (() => Promise<Router<RouterRecord, InferRouterEnv<T>>>),
> = T extends Hono<InferRouterEnv<T>, infer S>
	? S extends RouterSchema<infer B>
		? B extends MergeRoutes<infer C>
			? C extends InferSchemaFromRouters<infer D>
				? {
						[K1 in keyof D]: D[K1] extends () => Promise<Router<infer P, Env>>
							? { [K2 in keyof P]: ClientRequest<OperationSchema<P[K2]>> }
							: D[K1] extends Router<infer P, Env>
								? { [K2 in keyof P]: ClientRequest<OperationSchema<P[K2]>> }
								: never;
					}
				: never
			: never
		: never
	: never;

type Client1<
	T extends
		| Router<RouterRecord, InferRouterEnv<T>>
		| (() => Promise<Router<RouterRecord, InferRouterEnv<T>>>),
> = T extends Hono<InferRouterEnv<T>, infer S> ? true : false;

type Client1_Actual = Client1<TestAppRouter>;

type Client2<
	T extends
		| Router<RouterRecord, InferRouterEnv<T>>
		| (() => Promise<Router<RouterRecord, InferRouterEnv<T>>>),
> = T extends Hono<InferRouterEnv<T>, infer S>
	? S extends RouterSchema<infer B>
		? true
		: S
	: T;

type Client2_Actual = Client2<TestAppRouter>;

type Client3<
	T extends
		| Router<RouterRecord, InferRouterEnv<T>>
		| (() => Promise<Router<RouterRecord, InferRouterEnv<T>>>),
> = T extends Hono<InferRouterEnv<T>, infer S>
	? S extends RouterSchema<infer B>
		? B extends MergeRoutes<infer C>
			? true
			: B
		: S
	: T;

type Client3_Actual = Client3<TestAppRouter>;

type Client4<
	T extends
		| Router<RouterRecord, InferRouterEnv<T>>
		| (() => Promise<Router<RouterRecord, InferRouterEnv<T>>>),
> = T extends Hono<InferRouterEnv<T>, infer S>
	? S extends RouterSchema<infer B>
		? B extends MergeRoutes<infer C>
			? C extends InferSchemaFromRouters<infer D>
				? true
				: C
			: B
		: S
	: T;

type Client4_Actual = Client4<TestAppRouter>;

type Client_Actual = Client<TestAppRouter>;

type Client_Expected = {
	auth: {
		test: ClientRequest<{
			$get: {
				input: void;
				output: {
					message: string;
				};
				outputFormat: "json";
				status: StatusCode;
			};
		}>;
		test2: ClientRequest<{
			$post: {
				input: {
					name: string;
				};
				output: {
					message: string;
				};
				outputFormat: "json";
				status: StatusCode;
			};
		}>;
	};
};
