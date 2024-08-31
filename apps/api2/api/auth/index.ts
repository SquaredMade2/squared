import type { User, Workspace } from "@repo/db";
import { prisma } from "@/api";
import jwt from "jsonwebtoken";
import type { Route } from "@/api/route";
import { comparePassword, hashPassword, sendMail } from "./helpers";

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
				const { email, password, provider, type, name, username } = body.login;

				// Validation for Login Data
				if (!email || (provider === "credentials" && !password)) {
					return {
						data: {
							user: null,
							message: "Email and password are required.",
							variant: "destructive",
						},
					};
				}

				if (!JWT_SECRET) {
					return {
						data: {
							user: null,
							message: "JWT_SECRET is not defined.",
							variant: "destructive",
						},
					};
				}

				// Registration Logic
				if (type === "register") {
					// Registration Validation
					if (!name) {
						return {
							data: {
								user: null,
								message: "Name is required.",
								variant: "destructive",
							},
						};
					}
					if (!password || password.length < 6) {
						return {
							data: {
								user: null,
								message:
									"Password is required and should be at least 6 characters long.",
								variant: "destructive",
							},
						};
					}

					// Check if they already exist
					const existingUser = await prisma.user.findUnique({
						where: { email },
					});

					if (existingUser) {
						return {
							data: {
								user: null,
								message: "This email is already registered.",
								variant: "destructive",
							},
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
							verified: false,
						},
					});

					// Send a verification email
					const emailToken = jwt.sign({ user: user.id }, JWT_SECRET, {
						expiresIn: "1d",
					});

					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					await sendMail(email, username!, emailToken, "confirmation");

					return {
						data: {
							user,
							message: `Sent a verification email to ${email}`,
							variant: "default",
						},
					};
				}
				if (type === "login") {
					// Check if the user exists
					const user: User | null = await prisma.user.findUnique({
						where: { email },
					});

					if (!user) {
						return {
							data: {
								user: null,
								message: "No user found, please register.",
								variant: "destructive",
							},
						};
					}

					if (!user.verified) {
						const emailToken = jwt.sign({ user: user.id }, JWT_SECRET, {
							expiresIn: "1d",
						});

						// Send verification email if they're not verified
						await sendMail(email, user.name, emailToken, "confirmation");

						return {
							data: {
								user: null,
								message:
									"Your email is not verified. A verification link has been sent to your email.",
								variant: "destructive",
							},
						};
					}

					// Logic for if they logged in with email and password
					if (provider === "credentials") {
						if (!password) {
							return {
								data: {
									user: null,
									message: "Password is required.",
									variant: "destructive",
								},
							};
						}
						const passwordMatch = await comparePassword(
							password,
							user.password,
						);

						if (!passwordMatch) {
							return {
								data: {
									user: null,
									message: "Incorrect Password",
									variant: "destructive",
								},
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
						data: {
							user,
							message: "Login successful.",
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
