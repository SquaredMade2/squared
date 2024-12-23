import { createRpcHandler, createServiceSchema } from "@squared/rpc";
import z from "zod";
import { commentSchema } from "../schema";
import type { CommentRpc } from "./types";
import { logger } from "../index";

export const commentRpcSchema = createServiceSchema<CommentRpc>()({
	addComment: {
		input: z.object({ comment: commentSchema.omit({ id: true }) }),
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
	}, logger);

export { CommentService } from "./comment-service";
