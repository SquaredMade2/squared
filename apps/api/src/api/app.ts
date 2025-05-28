import type { Env } from "@/env";
import appRouter from "@/services";
import { cors, errorHandler, notFound } from "@squaredmade/server/middleware";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono<Env>({ strict: false });

app.route("/rpc", appRouter);
app.get("/", (c) => c.text("ok", 200));
app.use(cors);
app.notFound(notFound);
app.onError(errorHandler);
app.use(logger());

export default app;
