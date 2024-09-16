import type { User } from "@prisma/client";
import type { Route, APIResponse } from "../../route";

type Params = {
	userId: string;
};

export function createRoute(): Route<Params> {
	return {
		POST: async (res, { userId }, body: Body): Promise<APIResponse<User>> => {
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
