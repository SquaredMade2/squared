import type { Comment } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	taskId: string;
};

type CommentResponse = {
	comments : Comment[] | null,
	message?: string,
	variant: "default" | "destructive"
}

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { taskId }): Promise<CommentResponse> => {
			try {
				// Find comments by team ID
				const comments: Comment[] | null = await prisma.comment.findMany({
					where: { taskId },
				});

				if (!comments) {
					return { 
						comments: comments,
						message: "comments not found",
						variant: "destructive"
					};
				}

				// Return the found comments
				return { 
					comments: comments,
					variant: "default"
				};
			} catch (error) {
				console.error("Error finding comments:", error);
				return { 
					comments: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
	};
}
