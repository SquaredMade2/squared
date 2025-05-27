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
	deleteComment: workspaceProcedure
		.input(z.object({ commentId: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { commentService, userId } = ctx;
			const { commentId } = input;
			const comment = await commentService.getCommentById(TODO, { commentId });
			if (!comment) {
				throw new Error("Comment does not exist.");
			}
			if (comment.authorId !== userId) {
				throw new Error("You are not authorized to delete this comment.");
			}
			return c.superjson(
				await commentService.deleteComment(TODO, { commentId }),
			);
		}),
});
