import type { User } from "@repo/db";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	userId: string;
};

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
				console.error("Error with auth request:", error);
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
