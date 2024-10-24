import type { Workspace } from "@squared/db";
import type { Route, APIResponse } from "@/api/route";
import { joinWorkspace } from "@/utils/joinWorkspace";

type JoinBody = {
	token: string;
	userId: string;
};

export function createRoute(): Route {
	return {
		POST: async (res, _, body: JoinBody): Promise<APIResponse<Workspace>> => {
			try {
				const { token, userId } = body;
				const { status, ...response } = await joinWorkspace(token, userId);
				res.status(status);
				return response;
			} catch (error) {
				console.error("Error processing request:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error.",
					variant: "destructive",
				};
			}
		},
	};
}
