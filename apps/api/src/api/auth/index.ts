import type { User } from "@squared/db";
import { prisma } from "@/api";
import jwt from "jsonwebtoken";
import type { Route, APIResponse } from "@/api/route";
import { comparePassword, hashPassword, returnToken } from "./helpers";
import { sendMail } from "@/utils/mail";
import { joinWorkspace } from "@/utils/joinWorkspace";
import { verifyEmailTemplate } from "@/utils/templates";
import createCustomLogger from "@squared/logger";

type Body = {
	provider: "credentials" | "google" | "github";
	type: "register" | "login" | "logout";
	email: string;
	password?: string;
	name?: string;
	username?: string;
	oauthId?: string;
	token?: string;
	avatarUrl?: string;
};

type Params = {
	userId: string;
};

const JWT_SECRET = process.env.JWT_SECRET;

const logger = createCustomLogger("auth");

export function createRoute(): Route<Params> {
	return {
		POST: async (res, _, body: Body): Promise<APIResponse<User>> => {
			try {
				const {
					email,
					password,
					provider,
					type,
					name,
					username,
					avatarUrl,
					token: joinWorkspaceToken,
				} = body;
				let user: User | null = await prisma.user.findUnique({
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
				switch (provider) {
					case "google": {
						if (!user) {
							user = await prisma.user.create({
								data: {
									email,
									name: name ?? email.split("@")[0],
									username,
									googleId: body.oauthId,
									verified: true,
									avatarUrl,
								},
							});
						} else if (user && user.googleId !== body.oauthId) {
							return {
								data: null,
								message:
									"This email is already registered with a different account.",
								variant: "destructive",
							};
						}
						const { token } = await returnToken(user, JWT_SECRET);
						res.cookie("token", token);
						if (joinWorkspaceToken && user) {
							const { status, data, ...response } = await joinWorkspace(
								joinWorkspaceToken,
								user.id,
							);
							if (status === 200) {
								const newUser = await prisma.user.findUnique({
									where: { id: user.id },
								});
								return { ...response, data: newUser };
							}
							return { ...response, data: user };
						}

						return {
							data: user,
							message: "Login successful.",
							variant: "default",
						};
					}
					case "github": {
						if (!user) {
							user = await prisma.user.create({
								data: {
									email,
									name: name ?? email.split("@")[0],
									username,
									githubId: body.oauthId,
									verified: true,
									avatarUrl,
								},
							});
						} else if (user && user.githubId !== body.oauthId) {
							return {
								data: null,
								message:
									"This email is already registered with a different account.",
								variant: "destructive",
							};
						}

						const { token } = await returnToken(user, JWT_SECRET);
						res.cookie("token", token);
						if (joinWorkspaceToken && user) {
							const { status, data, ...response } = await joinWorkspace(
								joinWorkspaceToken,
								user.id,
							);
							if (status === 200) {
								const newUser = await prisma.user.findUnique({
									where: { id: user.id },
								});
								return { ...response, data: newUser };
							}
							return { ...response, data: user };
						}

						return {
							data: user,
							message: "Login successful.",
							variant: "default",
						};
					}
					case "credentials": {
						// Validation for Login Data
						if (!email || !password) {
							return {
								data: null,
								message: "Email and password are required.",
								variant: "destructive",
							};
						}

						if (type === "register") {
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

							const user = await prisma.user.create({
								data: {
									name,
									username,
									email,
									password: hashedPassword,
								},
							});
							if (joinWorkspaceToken && user) {
								const { status, data, ...response } = await joinWorkspace(
									joinWorkspaceToken,
									user.id,
								);
								if (status === 200) {
									const newUser = await prisma.user.findUnique({
										where: { id: user.id },
									});
									return { ...response, data: newUser };
								}
								return { ...response, data: user };
							}

							// Send a verification email
							const emailToken = jwt.sign({ user: user.id }, JWT_SECRET, {
								expiresIn: "1d",
							});
							try {
								await sendMail({
									logger,
									email,
									subject: "Welcome to Squared!",
									html: verifyEmailTemplate(`verify/${emailToken}`),
								});
							} catch (error) {
								logger.error("Error sending email: %0", error);
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

							if (!user) {
								return {
									data: null,
									message: "No user found, please register.",
									variant: "destructive",
								};
							}

							if (joinWorkspaceToken && user) {
								const { status } = await joinWorkspace(
									joinWorkspaceToken,
									user.id,
								);
								if (status === 200) {
									const newUser = await prisma.user.findUnique({
										where: { id: user.id },
									});
									if (newUser) user = newUser;
								}
							}

							if (!user.verified) {
								const emailToken = jwt.sign({ user: user.id }, JWT_SECRET, {
									expiresIn: "1d",
								});

								// Send verification email if they're not verified
								await sendMail({
									logger,
									email,
									subject: "Verify Your Email",
									html: verifyEmailTemplate(`verify/${emailToken}`),
								});
								return {
									data: null,
									message:
										"Your email is not verified. A verification link has been sent to your email.",
									variant: "destructive",
								};
							}

							// Logic for if they logged in with email and password

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

							const { token } = await returnToken(user, JWT_SECRET);

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
					}
					default:
						return {
							data: null,
							message: "Invalid provider.",
							variant: "destructive",
						};
				}
			} catch (error) {
				logger.error("Error with auth request: %0", error);
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
