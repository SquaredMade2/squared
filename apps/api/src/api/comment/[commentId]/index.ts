import { prisma } from "@/api";
import type { APIResponse, Route } from "@/api/route";
import type { Comment } from "@squared/db";
import createCustomLogger from "@squared/logger";

type Params = {
	commentId: string;
};

const logger = createCustomLogger("comment");

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { commentId }): Promise<APIResponse<Comment>> => {
			try {
				// Find the comment by its ID
				logger.info("Finding comment by ID: %s", commentId);
				const comment: Comment | null = await prisma.comment.findUnique({
					where: { id: commentId },
				});
				if (!comment) {
					return {
						data: null,
						message: "comment not found",
						variant: "destructive",
					};
				}

				// Return the found comment
				return {
					data: comment,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error finding comment: %0", error);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive",
				};
			}
		},
		PUT: async (res, { commentId }, body): Promise<APIResponse<Comment>> => {
			try {
				logger.info("Updating comment: %0", { commentId, body });
				const comment: Comment | null = await prisma.comment.update({
					where: { id: commentId },
					data: body,
				});
				if (!comment) {
					return {
						data: null,
						message: "Comment not found",
						variant: "destructive",
					};
				}

				// Return the updated comment
				return {
					data: comment,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error updating comment: %0", error);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive",
				};
			}
		},
		POST: async (res, { commentId }, body): Promise<APIResponse<Comment>> => {
			try {
				logger.info("Creating comment: %0", { commentId, body });
				const existingComment = await prisma.comment.findUnique({
					where: { id: commentId },
				});

				if (existingComment) {
					return {
						data: null,
						message: "Comment already exists",
						variant: "destructive",
					};
				}

				const newComment = await prisma.comment.create({
					data: {
						id: commentId,
						...body,
					} as Comment,
				});

				if (!newComment) {
					res.status(500);
					return {
						data: null,
						message: "Comment not created",
						variant: "destructive",
					};
				}

				// Return the new comment
				return {
					data: newComment,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error creating comment: %0", error);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive",
				};
			}
		},
		DELETE: async (res, { commentId }): Promise<APIResponse<Comment>> => {
			try {
				logger.info("Deleting comment: %s", commentId);
				const comment: Comment | null = await prisma.comment.delete({
					where: { id: commentId },
				});
				if (!comment) {
					return {
						data: null,
						message: "Comment not found",
						variant: "destructive",
					};
				}

				// Return success message
				return {
					data: null,
					message: "Comment deleted",
					variant: "default",
				};
			} catch (error) {
				logger.error("Error deleting comment: %0", error);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive",
				};
			}
		},
	};
}
