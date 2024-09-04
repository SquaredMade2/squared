import type { Comment } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	taskId: string;
};

type CommentReturn = {
	comments : Comment[] | null,
	message: string,
	variant: "default" | "destructive"
}

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { taskId }): Promise<CommentReturn> => {
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
					message: "",
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
