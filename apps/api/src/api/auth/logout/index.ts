import type { User } from "@squared/db";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

type Params = {
	userId: string;
};

const logger = createCustomLogger("auth");

export function createRoute(): Route<Params> {
	return {
		POST: async (res): Promise<APIResponse<User>> => {
			try {
				res.clearCookie("token");
				return {
					data: null,
					message: "logout successful.",
					variant: "default",
				};
			} catch (error) {
				logger.error("Error with auth request: %0", error);
				res.status(500);
				return {
					data: null,
					message:
						error instanceof Error
							? `Error logging out: ${error.message}`
							: "Error logging out: Internal server error",
					variant: "destructive",
				};
			}
		},
	};
}
