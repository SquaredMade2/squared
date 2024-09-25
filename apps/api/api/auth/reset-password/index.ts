import jwt from "jsonwebtoken";
import { sendMail } from "@/utils/mail";
import { prisma } from "@/api";
import type { User } from "@repo/db";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	email: string;
};

const JWT_SECRET = process.env.JWT_SECRET;

export function createRoute(): Route<Params> {
	return {
		POST: async (res, params: Params): Promise<APIResponse<User>> => {
			const { email } = params;
			try {
				const user = await prisma.user.findUnique({
					where: { email },
				});
				if (user) {
					const emailToken = jwt.sign({ user: user.id }, JWT_SECRET, {
						expiresIn: "1d",
					});
					try {
						// Send verification email for password reset
						await sendMail(
							email,
							user.name,
							emailToken,
							"password",
							"resetPassword",
						);
					} catch (error) {
						console.error("Error sending email:", error);
						res.status(500);
						return {
							data: null,
							message: "Error sending email.",
							variant: "destructive",
						};
					}
					return {
						data: user,
						message: `Sent a password reset email to ${email}`,
						variant: "default",
					};
				}
				return {
					data: null,
					message: "Email not found",
					variant: "destructive",
				};
			} catch (error) {
				console.error("Error verifying email:", error);
				res.status(500);
				return {
					data: null,
					message:
						error instanceof Error
							? `Error verifying email: ${error.message}`
							: "Error verifying email: Internal server error",
					variant: "destructive",
				};
			}
		},
	};
}
