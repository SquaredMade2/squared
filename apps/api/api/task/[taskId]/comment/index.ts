import type { Comment } from "@prisma/client";
import { prisma } from "../../..";
import type { Route, APIResponse } from "../../../route";

type Params = {
	taskId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { taskId }): Promise<APIResponse<Comment>> => {
			try {
				// Find comments by team ID
				const comments: Comment[] | null = await prisma.comment.findMany({
					where: { taskId },
				});

				if (!comments) {
					res.status(404);
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
				console.error("Error finding comments:", error);
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
