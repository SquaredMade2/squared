import type { User } from "@repo/db";
import { prisma } from "@/api";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import type { Route, APIResponse } from "@/api/route";
import { sendMail } from "@/utils/mail";

type Body = {
	token: string;
};

type Params = {
	userId?: string;
};

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export function createRoute(): Route<Params> {
	return {
		POST: async (res, _, body: Body): Promise<APIResponse<User>> => {
			try {
				const { token } = body;

				if (!GOOGLE_CLIENT_ID || !JWT_SECRET) {
					res.status(500);
					return {
						data: null,
						message: "Missing environment variables for Google OAuth",
						variant: "destructive",
					};
				}

				const ticket = await client.verifyIdToken({
					idToken: token,
					audience: GOOGLE_CLIENT_ID,
				});

				const payload = ticket.getPayload();

				if (!payload) {
					res.status(401);
					return {
						data: null,
						message: "Invalid token",
						variant: "destructive",
					};
				}

				const { email, name, sub: oAuthId } = payload;

				if (!email || !name || !oAuthId) {
					res.status(400);
					return {
						data: null,
						message: "Google profile is missing information.",
						variant: "destructive",
					};
				}

				// Check if the user already exists
				let user = await prisma.user.findUnique({
					where: { email },
				});

				if (!user) {
					// If user does not exist, create a new user
					user = await prisma.user.create({
						data: {
							email,
							name,
							username: name.toLowerCase().replace(/\s/g, "_"),
							oAuthId,
							verified: true,
						},
					});

					// Send a welcome email
					try {
						await sendMail(email, name, "", "welcome");
					} catch (error) {
						console.error("Error sending welcome email:", error);
					}
				} else if (!user.oAuthId) {
					// If user exists but does not have a Google ID, link the account
					user = await prisma.user.update({
						where: { email },
						data: { oAuthId },
					});
				}

				const tokenPayload = {
					email: user.email,
					id: user.id,
					name: user.name,
					defaultWorkspace: user.defaultWorkspaceId,
					lastLogin: user.lastLogin,
				};

				const jwtToken = jwt.sign(tokenPayload, JWT_SECRET, {
					expiresIn: "1h",
				});

				res.cookie("token", jwtToken);

				return {
					data: user,
					message: "Login successful.",
					variant: "default",
				};
			} catch (error) {
				console.error("Error with Google OAuth:", error);
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
