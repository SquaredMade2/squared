import type { User } from "@repo/db";
import type { Route } from "@/api/route";

type Login = {
	provider: "credentials" | "oauth";
	type: "register" | "login" | "logout";
	email: string;
	password?: string;
	name?: string;
	username?: string;
};

type Params = {
	userId: string;
};

type Body = {
	login: Login;
};

type AuthResponse = {
	user : User | null,
	message?: string,
	variant: "default" | "destructive"
}

const JWT_SECRET = process.env.JWT_SECRET;

export function createRoute(): Route<Params> {
	return {
		POST: async (res, { userId }, body: Body): Promise<AuthResponse> => {
			try {
				const { type } = body.login;

				if (type === "logout") {
					res.clearCookie("token");
					return {
						user: null,
						message: "logout successful.",
						variant: "default",
					}
				}
				// Default case if the type is neither 'register' nor 'login'
				res.status(401);
				return {
					user: null,
					message: "Invalid request type.",
					variant: "destructive",
				}
			} catch (error) {
				console.error("Error with auth request:", error);
				res.status(500);
				return {
					user: null,
					message:
						error instanceof Error
							? `Error logging out: ${error.message}`
							: "Error logging out: Internal server error",
					variant: "destructive",
				}

			}
		},
	};
}
