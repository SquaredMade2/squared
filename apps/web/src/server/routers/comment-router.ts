import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

export const commentRouter = router({
	getComments: privateProcedure
		.input(z.object({ taskId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { commentService } = ctx;
			const { taskId } = input;
			return c.superjson(
				await commentService.getTaskComments(TODO, { taskId }),
			);
		}),
	addComment: privateProcedure
		.input(z.object({ comment: z.string(), taskId: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { commentService, user } = ctx;
			const { comment, taskId } = input;
			return c.superjson(
				await commentService.addComment(TODO, {
					comment,
					taskId,
					authorId: user.id,
				}),
			);
		}),
});
