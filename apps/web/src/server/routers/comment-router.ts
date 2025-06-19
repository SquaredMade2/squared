import { TODO } from "@squaredmade/context";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { j, workspaceProcedure } from "../jstack";

export const commentRouter = j.router({
	getComments: workspaceProcedure
		.input(z.object({ taskId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { commentService } = ctx;
			const { taskId } = input;
			return c.superjson(
				await commentService.getTaskComments(TODO, { taskId }),
			);
		}),
	addComment: workspaceProcedure
		.input(z.object({ comment: z.string(), taskId: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { commentService, userId } = ctx;
			const { comment, taskId } = input;
			return c.superjson(
				await commentService.addComment(TODO, {
					comment,
					taskId,
					authorId: userId,
				}),
			);
		}),
	deleteComment: workspaceProcedure
		.input(z.object({ commentId: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { commentService } = ctx;
			const { commentId } = input;
			const comment = await commentService.deleteComment(TODO, { commentId });
			if (!comment) {
				throw new HTTPException(404, {
					message: `Comment: ${commentId} Does Not Exist`,
				});
			}
			return c.status(204);
		}),
});
