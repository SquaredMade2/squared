import type { Comment } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	commentId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async ({ commentId }) => {
			try {
				// Find the comment by its ID
				const comment: Comment | null = await prisma.comment.findUnique({
					where: { id: commentId },
				});

				if (!comment) {
					throw new Error("Comment not found");
				}

				// Return the found comment
				return comment;
			} catch (error) {
				console.error("Error finding comment:", error);
				throw new Error("Internal server error");
			}
		},
		PUT: async ({ commentId }, body) => {
			try {
				const comment: Comment | null = await prisma.comment.update({
					where: { id: commentId },
					data: body,
				});
				if (!comment) {
					throw new Error("Comment not found");
				}

				// Return the updated comment
				return comment;
			} catch (error) {
				console.error("Error updating comment:", error);
				throw new Error("Internal server error");
			}
		},
		POST: async ({ commentId }, body) => {
			try {
				const existingComment = await prisma.comment.findUnique({
					where: { id: commentId },
				});

				if (existingComment) {
					throw new Error("Comment already exists");
				}

				const newComment = await prisma.comment.create({
					data: {
						id: commentId,
						...body,
					} as Comment,
				});

				if (!newComment) {
					throw new Error("Comment not created");
				}

				// Return the new comment
				return newComment;
			} catch (error) {
				console.error("Error creating comment:", error);
				throw new Error("Internal server error");
			}
		},
		DELETE: async ({ commentId }) => {
			try {
				const comment: Comment | null = await prisma.comment.delete({
					where: { id: commentId },
				});
				if (!comment) {
					throw new Error("Comment not found");
				}

				// Return success message
				return { message: "Comment deleted" };
			} catch (error) {
				console.error("Error deleting comment:", error);
				throw new Error("Internal server error");
			}
		},
	};
}
