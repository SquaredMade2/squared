import type { Comment } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	commentId: string;
};

type CommentReturn = {
	comment : Comment | null,
	message: string,
	variant: "default" | "destructive"
}

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { commentId }): Promise<CommentReturn> => {
			try {
				// Find the comment by its ID
				const comment: Comment | null = await prisma.comment.findUnique({
					where: { id: commentId },
				});

				if (!comment) {
					return {
						comment: null,
						message: "comment not found",
						variant: "destructive"
					};
				}

				// Return the found comment
				return {
					comment: comment,
					message:"",
					variant:"default"
				};
			} catch (error) {
				console.error("Error finding comment:", error);
				return {
					comment: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
		PUT: async (res, { commentId }, body): Promise<CommentReturn> => {
			try {
				const comment: Comment | null = await prisma.comment.update({
					where: { id: commentId },
					data: body,
				});
				if (!comment) {
					return {
						comment: null,
						message: "Comment not found",
						variant: "destructive"
					};
				}

				// Return the updated comment
				return {
					comment: comment,
					message: "",
					variant: "default"
				};
			} catch (error) {
				console.error("Error updating comment:", error);
				return {
					comment: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
		POST: async (res, { commentId }, body): Promise<CommentReturn> => {
			try {
				const existingComment = await prisma.comment.findUnique({
					where: { id: commentId },
				});

				if (existingComment) {
					return {
						comment: null,
						message: "Comment already exists",
						variant: "destructive"
					};
				}

				const newComment = await prisma.comment.create({
					data: {
						id: commentId,
						...body,
					} as Comment,
				});

				if (!newComment) {
					return {
						comment: null,
						message: "Comment not created",
						variant: "destructive"
					};
				}

				// Return the new comment
				return {
					comment: newComment,
					message: "",
					variant: "default"
				};
			} catch (error) {
				console.error("Error creating comment:", error);
				return {
					comment: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
		DELETE: async (res, { commentId }): Promise<CommentReturn> => {
			try {
				const comment: Comment | null = await prisma.comment.delete({
					where: { id: commentId },
				});
				if (!comment) {
					return {
						comment: null,
						message: "Comment not found",
						variant: "destructive"
					};
				}

				// Return success message
				return { 
					comment: null,
					message: "Comment deleted",
					variant: "default" 
				};
			} catch (error) {
				console.error("Error deleting comment:", error);
				return {
					comment: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
	};
}
