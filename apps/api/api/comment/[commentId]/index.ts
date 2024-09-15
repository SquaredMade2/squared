import type { Comment } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	commentId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { commentId }): Promise<APIResponse<Comment>> => {
			try {
				// Find the comment by its ID
				const comment: Comment | null = await prisma.comment.findUnique({
					where: { id: commentId },
				});

				res.status(404);
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
				console.error("Error finding comment:", error);
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
				const comment: Comment | null = await prisma.comment.update({
					where: { id: commentId },
					data: body,
				});
				if (!comment) {
					res.status(404);
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
				console.error("Error updating comment:", error);
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
				const existingComment = await prisma.comment.findUnique({
					where: { id: commentId },
				});

				if (existingComment) {
					res.status(401);
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
				console.error("Error creating comment:", error);
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
				const comment: Comment | null = await prisma.comment.delete({
					where: { id: commentId },
				});
				if (!comment) {
					res.status(404);
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
				console.error("Error deleting comment:", error);
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
