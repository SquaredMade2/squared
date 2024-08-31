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

type AuthReturn = {
	data: {
		user: User | null;
		message: string;
		variant: "destructive" | "default";
	};
};

const JWT_SECRET = process.env.JWT_SECRET;

export function createRoute(): Route<Params> {
	return {
		POST: async ({ userId }, body: Body, res): Promise<AuthReturn> => {
			try {
				const { type } = body.login;

				if (type === "logout") {
					res.clearCookie("token");
					return {
						data: {
							user: null,
							message: "logout successful.",
							variant: "default",
						},
					};
				}

				// Default case if the type is neither 'register' nor 'login'
				return {
					data: {
						user: null,
						message: "Invalid request type.",
						variant: "destructive",
					},
				};
			} catch (error) {
				console.error("Error with auth request:", error);
				return {
					data: {
						user: null,
						message: "Internal server error",
						variant: "destructive",
					},
				};
			}
		},
	};
}
