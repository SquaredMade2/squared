import type { Env, Hono, Schema } from "hono";
import { Router } from "./router";

// Define a generic Router type constraint
type AnyRouter = Router<Record<string, unknown>, Env>;

// Define a generic Hono type constraint
type AnyHono<S extends Schema> = Hono<Env, S, string>;

export type InferSchemaFromRouters<
	R extends Record<string, AnyRouter | (() => Promise<AnyRouter>)>,
> = {
	[P in keyof R]: R[P] extends () => Promise<AnyRouter>
		? R[P] extends () => Promise<infer T>
			? T extends AnyHono<infer S>
				? { [Q in keyof S]: S[Q] }
				: never
			: never
		: R[P] extends AnyHono<infer S>
			? { [Q in keyof S]: S[Q] }
			: never;
};

export function mergeRouters<
	R extends Record<string, AnyRouter | (() => Promise<AnyRouter>)>,
>(api: AnyHono<Schema>, routers: R): Router<InferSchemaFromRouters<R>> {
	const mergedRouter = new Router();
	Object.assign(mergedRouter, api);

	mergedRouter._metadata = {
		subRouters: {},
		config: {},
		procedures: {},
		registeredPaths: [],
	};

	for (const [key, router] of Object.entries(routers)) {
		// lazy-loaded routers using `dynamic()` use proxy to avoid loading bundle initially
		if (typeof router === "function") {
			const proxyRouter = new Router();

			proxyRouter.all("*", async (c) => {
				const actualRouter = await router();
				mergedRouter._metadata.subRouters[`/api/${key}`] = actualRouter;

				return actualRouter.fetch(c.req.raw, c.env);
			});
			mergedRouter._metadata.subRouters[`/api/${key}`] = proxyRouter;
		} else if (router instanceof Router) {
			// statically imported routers can be assigned directly
			mergedRouter._metadata.subRouters[`/api/${key}`] = router;
		}
	}

	mergedRouter.registerSubrouterMiddleware();

	return mergedRouter as Router<InferSchemaFromRouters<R>>;
}
