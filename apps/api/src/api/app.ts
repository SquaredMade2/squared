import type { Env } from "@/env";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createRequestHandler, jstack } from "@squaredmade/rpc";
import { cors, errorHandler, notFound } from "@squaredmade/server/middleware";
import { logger } from "hono/logger";

const app = new OpenAPIHono({ strict: false });

export const j = jstack.init<Env>();
const rpcRequestHandler = createRequestHandler(Object.values(rpcHandlers));
app.all("/rpc/*", rpcRequestHandler);

app.get("/", (c) => c.text("ok", 200));
app.use(cors);
app.notFound(notFound);
app.onError(errorHandler);
app.use(logger());

export default app;
