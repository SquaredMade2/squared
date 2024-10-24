import type { Comment } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

type Params = {
	taskId: string;
};

const logger = createCustomLogger("task");

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { taskId }): Promise<APIResponse<Comment>> => {
			try {
				// Find comments by team ID
				logger.info("Finding comments by task ID: %s", taskId);
				const comments: Comment[] | null = await prisma.comment.findMany({
					where: { taskId },
				});

				if (!comments) {
					return {
						data: comments,
						message: "comments not found",
						variant: "destructive",
					};
				}

				// Return the found comments
				return {
					data: comments,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error finding comments: %0", error);
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
