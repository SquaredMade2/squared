import jwt from "jsonwebtoken";
import { prisma } from "@/api";
import type { User } from "@squared/db";
import type { Route, APIResponse } from "@/api/route";
import { hashPassword } from "../../helpers";

type Params = {
	token: string;
};

type Body = {
	token: string;
	newPassword: string;
};

type JwtPayload = {
	user: string;
};

const JWT_SECRET = process.env.JWT_SECRET;

export function createRoute(): Route<Params> {
	return {
		POST: async (
			res,
			params: Params,
			body: Body,
		): Promise<APIResponse<User>> => {
			const { token } = params;
			const { newPassword } = body;
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

					const hashedPassword = await hashPassword(newPassword);

					const user = await prisma.user.update({
						where: { id: decoded.user },
						data: { password: hashedPassword },
					});
					res.status(200);
					return {
						data: user,
						message: "Password successfully updated",
						variant: "default",
					};
				}
				res.status(400);
				return {
					data: null,
					message: "Invalid token",
					variant: "destructive",
				};
			} catch (error) {
				console.error("Error with password update:", error);
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
