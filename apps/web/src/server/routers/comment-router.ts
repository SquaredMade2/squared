import { TODO } from "@squaredmade/context";
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
});
