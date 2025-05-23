import { rpcHandlers } from "@/services";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createRequestHandler } from "@squaredmade/rpc";
import { cors, errorHandler, notFound } from "@squaredmade/server/middleware";
import { logger } from "hono/logger";

const app = new OpenAPIHono({ strict: false });

// Health check route for root path
app.get("/", (c) => c.text("ok", 200));
app.use("/*", cors);

const rpcRequestHandler = createRequestHandler(Object.values(rpcHandlers));
app.use("/rpc/*", rpcRequestHandler);

app.notFound(notFound);
app.onError(errorHandler);
app.use(logger());

export default app;
