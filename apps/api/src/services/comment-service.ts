import { baseProcedure, j } from "@/middleware";
import { commentsTable, eq } from "@squaredmade/db";
import { HTTPException } from "hono/http-exception";
import z from "zod/v4";
import { commentSchema } from "./schema";

export const commentService = j.router({
	addComment: baseProcedure
		.input(commentSchema.omit({ id: true, date: true }))
		.mutation(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			logger.info("Adding comment with payload", input);
			const [comment] = await db
				.insert(commentsTable)
				.values(input)
				.returning();

			if (!comment) {
				logger.error("Something went wrong while adding comment using:", input);
				throw new HTTPException(400, { message: "Adding Comment Failed" });
			}

			return c.superjson(comment, 201);
		}),
	deleteComment: baseProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			logger.info("Deleting comment with id", input.id);
			await db.delete(commentsTable).where(eq(commentsTable.id, input.id));
			return c.status(204);
		}),
	getTaskComments: baseProcedure
		.input(z.object({ taskId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			logger.info("Getting comments for task with id", input.taskId);
			const comments = await db
				.select()
				.from(commentsTable)
				.where(eq(commentsTable.taskId, input.taskId));
			return c.superjson(comments);
		}),
});
