import { createRpcHandler, createServiceSchema } from "@squaredmade/rpc";
import z from "zod";
import { commentSchema } from "../schema";
import type { CommentRpc } from "./types";

export const commentRpcSchema = createServiceSchema<CommentRpc>()({
	addComment: {
		input: commentSchema.omit({ id: true, date: true }),
		output: z.array(commentSchema),
	},
	deleteComment: {
		input: z.object({ commentId: z.string() }),
		output: z.void(),
	},
	getTaskComments: {
		input: z.object({ taskId: z.string() }),
		output: z.array(commentSchema),
	},
});

export type CommentRpcSchema = typeof commentRpcSchema;

export const createCommentRpcHandler = (commentService: CommentRpc) =>
	createRpcHandler("comment", commentRpcSchema, {
		addComment: (input) => commentService.addComment(input),
		deleteComment: (input) => commentService.deleteComment(input),
		getTaskComments: (input) => commentService.getTaskComments(input),
	});

export { CommentService } from "./comment-service";
