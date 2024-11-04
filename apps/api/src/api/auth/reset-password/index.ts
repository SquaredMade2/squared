import jwt from "jsonwebtoken";
import { sendMail } from "@/utils/mail";
import { prisma } from "@/api";
import type { User } from "@squared/db";
import type { Route, APIResponse } from "@/api/route";
import { passwordResetTemplate } from "@/utils/templates";
import createCustomLogger from "@squared/logger";

type Body = {
	email: string;
};

const JWT_SECRET = process.env.JWT_SECRET;

const logger = createCustomLogger("auth");

export function createRoute(): Route {
	return {
		POST: async (res, _, body: Body): Promise<APIResponse<User>> => {
			const { email } = body;
			try {
				const user = await prisma.user.findUnique({
					where: { email },
				});

				if (!JWT_SECRET) {
					res.status(500);
					return {
						data: null,
						message: "JWT_SECRET is not defined.",
						variant: "destructive",
					};
				}

				if (user) {
					const emailToken = jwt.sign({ user: user.id }, JWT_SECRET, {
						expiresIn: 60 * 15,
					});
					try {
						// Send verification email for password reset
						await sendMail({
							logger,
							email,
							html: passwordResetTemplate(`forgotPassword/${emailToken}`),
							subject: "Reset your password",
						});
					} catch (error) {
						logger.error("Error sending email: %0", error);
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
				logger.error("Error verifying email: %0", error);
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
