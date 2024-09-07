import type { User } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import jwt from "jsonwebtoken";

type Params = {
	token: string;
};
type JwtPayload = {
	user: string;
};

const JWT_SECRET = process.env.JWT_SECRET;

export function createRoute(): Route<Params> {
	return {
		POST: async (res, params: Params): Promise<APIResponse<User>> => {
			const { token } = params;
			try {
				if (!JWT_SECRET) {
					res.status(500);
					return {
						data: null,
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
						data: user,
						message: "User verified",
						variant: "default",
					};
				} else {
					res.status(403);
					return {
						data: null,
						message: "invalid token",
						variant: "destructive",
					};
				}
			} catch (error) {
				console.error("Error with auth request:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
	};
}
