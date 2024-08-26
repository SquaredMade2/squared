import type { Comment } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	taskId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async ({ taskId }) => {
			try {
				// Find comments by team ID
				const comments: Comment[] | null = await prisma.comment.findMany({
					where: { taskId },
				});

				if (!comments) {
					throw new Error("Comments not found");
				}

				// Return the found comments
				return comments;
			} catch (error) {
				console.error("Error finding comments:", error);
				throw new Error("Internal server error");
			}
		},
	};
}
