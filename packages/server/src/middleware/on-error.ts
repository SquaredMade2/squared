import { HTTPException } from "hono/http-exception";
import type { HTTPResponseError } from "hono/types";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";
import {
	INTERNAL_SERVER_ERROR,
	UNPROCESSABLE_ENTITY,
} from "../http-status-codes";

export const errorHandler = (err: Error | HTTPResponseError) => {
	console.error("[API Error]", err);

	if (err instanceof HTTPException) {
		return err.getResponse();
	}
	if (err instanceof ZodError) {
		const httpError = new HTTPException(UNPROCESSABLE_ENTITY, {
			message: "Validation error",
			cause: err,
		});

		return httpError.getResponse();
	}
	if ("status" in err && typeof err.status === "number") {
		const httpError = new HTTPException(err.status as ContentfulStatusCode, {
			message: err.message || "API Error",
			cause: err,
		});

		return httpError.getResponse();
	}
	const httpError = new HTTPException(INTERNAL_SERVER_ERROR, {
		message: "An unexpected error occurred. Check server logs for details.",
		cause: err,
	});

	return httpError.getResponse();
};
