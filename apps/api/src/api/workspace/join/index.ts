import type { APIResponse, Route } from "@/api/route";
import { joinWorkspace } from "@/utils/joinWorkspace";
import type { Workspace } from "@squared/db";
import createCustomLogger from "@squared/logger";

type JoinBody = {
	token: string;
	userId: string;
};

const logger = createCustomLogger("join-workspace");

export function createRoute(): Route {
	return {
		POST: async (res, _, body: JoinBody): Promise<APIResponse<Workspace>> => {
			try {
				const { token, userId } = body;
				logger.info("Joining workspace: %0", { token, userId });
				const { status, ...response } = await joinWorkspace(token, userId);
				res.status(status);
				return response;
			} catch (error) {
				logger.error("Error processing request: %0", error);
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
