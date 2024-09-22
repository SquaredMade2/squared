import type { User, Workspace } from "@repo/db";
import { prisma } from "@/api";
import jwt from "jsonwebtoken";
import type { Route, APIResponse } from "@/api/route";
import { comparePassword, hashPassword } from "./helpers";
import { sendMail } from "@/utils/mail";

type Body = {
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

const JWT_SECRET = process.env.JWT_SECRET;

export function createRoute(): Route<Params> {
	return {
		POST: async (res, _, body: Body): Promise<APIResponse<User>> => {
			try {
				const { email, password, provider, type, name, username } = body;

				// Validation for Login Data
				if (!email || (provider === "credentials" && !password)) {
					return {
						data: null,
						message: "Email and password are required.",
						variant: "destructive",
					};
				}

				if (!JWT_SECRET) {
					res.status(500);
					return {
						data: null,
						message: "JWT_SECRET is not defined.",
						variant: "destructive",
					};
				}

				// Registration Logic
				if (type === "register") {
					// Registration Validation
					if (!name || !username) {
						return {
							data: null,
							message: "Name is required.",
							variant: "destructive",
						};
					}
					if (!password || password.length < 6) {
						return {
							data: null,
							message:
								"Password is required and should be at least 6 characters long.",
							variant: "destructive",
						};
					}

					// Check if they already exist
					const existingUser = await prisma.user.findUnique({
						where: { email },
					});

					if (existingUser) {
						return {
							data: null,
							message: "This email is already registered.",
							variant: "destructive",
						};
					}

					// Creating the user
					const hashedPassword = await hashPassword(password);

					// TODO: FIX EMAIL VERIFICATION
					const user = await prisma.user.create({
						data: {
							name,
							username,
							email,
							password: hashedPassword,
						},
					});

					// Send a verification email
					const emailToken = jwt.sign({ user: user.id }, JWT_SECRET, {
						expiresIn: "1d",
					});
					try {
						await sendMail(email, username, emailToken, "confirmation");
					} catch (error) {
						console.error("Error sending email:", error);
						await prisma.user.delete({ where: { id: user.id } });
						res.status(500);
						return {
							data: null,
							message: "Error sending email.",
							variant: "destructive",
						};
					}
					return {
						data: user,
						message: `Sent a verification email to ${email}`,
						variant: "default",
					};
				}
				if (type === "login") {
					// Check if the user exists
					let user: User | null = await prisma.user.findUnique({
						where: { email },
					});

					if (provider === "oauth") {
						if (!user) {
							// If the user doesn't exist, create them
							user = await prisma.user.create({
								data: {
									email,
									name: name ?? email.split("@")[0],
									username,
									verified: true,
								},
							});
						}
					}

					if (!user) {
						return {
							data: null,
							message: "No user found, please register.",
							variant: "destructive",
						};
					}

					if (!user.verified) {
						const emailToken = jwt.sign({ user: user.id }, JWT_SECRET, {
							expiresIn: "1d",
						});

						// Send verification email if they're not verified
						await sendMail(email, user.name, emailToken, "confirmation");
						return {
							data: null,
							message:
								"Your email is not verified. A verification link has been sent to your email.",
							variant: "destructive",
						};
					}

					// Logic for if they logged in with email and password
					if (provider === "credentials") {
						if (!password) {
							return {
								data: null,
								message: "Password is required.",
								variant: "destructive",
							};
						}

						if (!user.password) {
							return {
								data: null,
								message: "This user has no password.",
								variant: "destructive",
							};
						}

						const passwordMatch = await comparePassword(
							password,
							user.password,
						);

						if (!passwordMatch) {
							return {
								data: null,
								message: "Incorrect Password",
								variant: "destructive",
							};
						}
					}

					const userWorkspaces: Workspace[] = await prisma.userWorkspace
						.findMany({
							where: { userId: user.id },
							include: { workspace: true },
						})
						.then((workspaces) => workspaces.map((uw) => uw.workspace));

					const token = jwt.sign(
						{
							email: user.email,
							id: user.id,
							name: user.name,
							defaultWorkspace: user.defaultWorkspaceId,
							lastLogin: user.lastLogin,
							workspaces: userWorkspaces,
						},
						JWT_SECRET,
					);

					// You would typically set the token in the user's state or storage here
					res.cookie("token", token);

					return {
						data: user,
						message: "Login successful.",
						variant: "default",
					};
				}
				// Default case if the type is neither 'register' nor 'login'
				return {
					data: null,
					message: "Invalid request type.",
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
