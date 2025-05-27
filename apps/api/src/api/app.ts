import appRouter, { type AppRouter } from "@/services";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createClient } from "@squaredmade/rpc";
import { cors, errorHandler, notFound } from "@squaredmade/server/middleware";
import { logger } from "hono/logger";

const app = new OpenAPIHono({ strict: false });

app.all("/rpc/*", (c) => appRouter.handler.fetch(c.req.raw, c.env));
const client = createClient<AppRouter>({
	baseUrl: "http://localhost:3000",
});

console.log("Router API: ", JSON.stringify(appRouter, null, 2));

app.get("/", (c) => c.text("ok", 200));
app.use(cors);
app.notFound(notFound);
app.onError(errorHandler);
app.use(logger());

export default app;
