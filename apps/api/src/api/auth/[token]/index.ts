import type { User } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import jwt from "jsonwebtoken";

type Params = {
	token: string;
};
type Body = {
	validate?: boolean;
};
type JwtPayload = {
	user: string;
};

interface TokenExpiredError extends Error {
	name: "TokenExpiredError";
	message: string;
	expiredAt: number;
}

const JWT_SECRET = process.env.JWT_SECRET;

export function createRoute(): Route<Params> {
	return {
		POST: async (
			res,
			params: Params,
			body: Body,
		): Promise<APIResponse<User>> => {
			const { token } = params;
			const { validate } = body;

			try {
				if (!JWT_SECRET) {
					res.status(500);
					return {
						data: null,
						message: "JWT_SECRET is not defined.",
						variant: "destructive",
					};
				}
				if (token && validate) {
					let isExpired: JwtPayload | string | undefined;
					try {
						isExpired = jwt.verify(token, JWT_SECRET) as JwtPayload;
					} catch (error: unknown) {
						if (error as TokenExpiredError) {
							const tokenError = error as TokenExpiredError;
							isExpired = tokenError.name;
						} else if (error instanceof Error) {
							isExpired = error.name;
						}
					}

					if (
						isExpired === "TokenExpiredError" ||
						isExpired === "JsonWebTokenError"
					) {
						const decoded: JwtPayload = jwt.decode(token) as JwtPayload;
						const user = await prisma.user.findUnique({
							where: { id: decoded.user },
						});
						return {
							data: user,
							message: "Token is expired or invalid",
							variant: "destructive",
						};
					}
					return {
						data: null,
						message: "Token verified",
						variant: "default",
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
				}
				return {
					data: null,
					message: "invalid token",
					variant: "destructive",
				};
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
