import type { User } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";
import jwt from "jsonwebtoken";

type Params = {
	token: string;
};
type JwtPayload = {
	user: string;
};

type AuthReturn = {
	user : User | null,
	message: string,
	variant: "default" | "destructive"
}

const JWT_SECRET = process.env.JWT_SECRET;

export function createRoute(): Route<Params> {
	return {
		POST: async (res, params: Params): Promise<AuthReturn> => {
			const { token } = params;
			try {
				if (!JWT_SECRET) {
					return {
						user: null,
						message: "JWT_SECRET is not defined.",
						variant: "destructive",
					};
				}
				if (token) {
					const decoded: JwtPayload = jwt.verify(
						token,
						JWT_SECRET,
					) as JwtPayload;
					const user = await prisma.user.update({
						where: { id: decoded.user },
						data: { verified: true },
					});
					return {
						user,
						message: "User verified",
						variant: "default",
					};
				} else{
					return {
						user: null,
						message: "invalid token",
						variant: "destructive",
					};
				}
			} catch (error) {
				console.error("Error with auth request:", error);
				return {
					user: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
	};
}
