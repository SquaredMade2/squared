import appRouter from "@/services";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors, errorHandler, notFound } from "@squaredmade/server/middleware";
import { logger } from "hono/logger";

const app = new OpenAPIHono({ strict: false });

app.all("/rpc/*", (c) => appRouter.handler.fetch(c.req.raw, c.env));

console.log("Router API: ", JSON.stringify(appRouter.routes, null, 2));

app.get("/", (c) => c.text("ok", 200));
app.use(cors);
app.notFound(notFound);
app.onError(errorHandler);
app.use(logger());

export default app;
