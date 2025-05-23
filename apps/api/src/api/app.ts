import { rpcHandlers } from "@/services";
import { OpenAPIHono } from "@hono/zod-openapi";
import createCustomLogger from "@squaredmade/logger";
import { createErrorHandler, createRequestHandler } from "@squaredmade/rpc";
import { cors, errorHandler, notFound } from "@squaredmade/server/middleware";

const app = new OpenAPIHono();
const logger = createCustomLogger("api");

app.get("/", (c) => c.text("ok", 200));

// Health check route for root path
app.get("/", (c) => c.text("ok", 200));
app.use("/*", cors);

const rpcRequestHandler = createRequestHandler(Object.values(rpcHandlers));
app.use("/rpc/*", rpcRequestHandler);

// Use the RPC error handler
app.use(createErrorHandler({ log: logger }));
app.notFound(notFound);
app.onError(errorHandler);

export default app;
