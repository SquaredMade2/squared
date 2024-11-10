import { joinWorkspace } from "@/utils/joinWorkspace";
import { sendMail } from "@/utils/mail";
import { passwordResetTemplate, verifyEmailTemplate } from "@/utils/templates";
import type { PrismaClient, User, Workspace } from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload, type TokenExpiredError } from "jsonwebtoken";
import type { AuthRpc, Login, OauthLogin, Register, UserToken } from "./types";

export class AuthService implements AuthRpc {
	private readonly db: PrismaClient;
	private readonly JWT_SECRET: string;
	private readonly logger: Logger;
	constructor(db: PrismaClient, secret?: string) {
		this.db = db;
		if (!secret) throw new Error("Invalid JWT Secret");
		this.JWT_SECRET = secret;
		this.logger = createCustomLogger("auth");
	}
	async login({ email, password }: Login): Promise<UserToken | null> {
		// Check if the user exists
		const user: User | null = await this.db.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw new Error("No user found, please register.");
		}

		if (!user.verified) {
			const emailToken = jwt.sign({ user: user.id }, this.JWT_SECRET, {
				expiresIn: "1d",
			});

			// Send verification email if they're not verified
			await sendMail({
				logger: this.logger,
				email,
				subject: "Verify Your Email",
				html: verifyEmailTemplate(`verify/${emailToken}`),
			});
			throw new Error(
				"Your email is not verified. A verification link has been sent to your email.",
			);
		}

		if (!user.password) throw new Error("This user has no password.");

		const passwordMatch = await this.comparePassword(password, user.password);

		if (!passwordMatch) throw new Error("Incorrect Password");

		const { token } = await this.returnToken(user, this.JWT_SECRET);

		return { user, token };
	}
	async googleLogin({
		email,
		oauthId,
		name,
		username,
		avatarUrl,
	}: OauthLogin): Promise<UserToken | null> {
		let user: User | null = await this.db.user.findUnique({
			where: { email },
		});
		if (!user) {
			user = await this.db.user.create({
				data: {
					email,
					name: name ?? email.split("@")[0],
					username,
					googleId: oauthId,
					verified: true,
					avatarUrl,
				},
			});
		} else if (user && user.googleId !== oauthId) {
			throw new Error(
				"This email is already registered with a different account.",
			);
		}
		const { token } = await this.returnToken(user, this.JWT_SECRET);

		return {
			user,
			token,
		};
	}
	async register({
		email,
		name,
		username,
		password,
		inviteToken,
	}: Register): Promise<User | null> {
		const existingUser = await this.db.user.findUnique({
			where: { email },
		});

		if (existingUser) throw new Error("This email is already registered.");

		// Creating the user
		const hashedPassword = await this.hashPassword(password);

		const user = await this.db.user.create({
			data: {
				name,
				username,
				email,
				password: hashedPassword,
			},
		});
		if (inviteToken && user) {
			const { status } = await joinWorkspace(inviteToken, user.id);
			if (status === 200) {
				const newUser = await this.db.user.findUnique({
					where: { id: user.id },
				});
				return newUser;
			}
			return user;
		}

		// Send a verification email
		const emailToken = jwt.sign({ user: user.id }, this.JWT_SECRET, {
			expiresIn: "1d",
		});
		try {
			await sendMail({
				logger: this.logger,
				email,
				subject: "Welcome to Squared!",
				html: verifyEmailTemplate(`verify/${emailToken}`),
			});
		} catch (error) {
			this.logger.error("Error sending email: %0", error);
			await this.db.user.delete({ where: { id: user.id } });
			throw new Error("Error sending email");
		}
		return user;
	}
	async verifyUser({ token }: { token: string }): Promise<User | null> {
		const decoded: JwtPayload = jwt.verify(
			token,
			this.JWT_SECRET,
		) as JwtPayload;
		const user = await this.db.user.update({
			where: { id: decoded.user },
			data: { verified: true },
		});
		return user;
	}
	async resetPasswordEmail({ email }: { email: string }): Promise<void> {
		const user = await this.db.user.findUnique({
			where: { email },
		});

		if (user) {
			const emailToken = jwt.sign({ user: user.id }, this.JWT_SECRET, {
				expiresIn: 60 * 15,
			});
			try {
				// Send verification email for password reset
				await sendMail({
					logger: this.logger,
					email,
					html: passwordResetTemplate(`forgotPassword/${emailToken}`),
					subject: "Reset your password",
				});
			} catch (error) {
				this.logger.error("Error sending email: %0", error);
				throw new Error("Error sending email.");
			}
		}
		throw new Error("Email not found");
	}
	async resetPassword({
		token,
		newPassword,
	}: { token: string; newPassword: string }): Promise<void> {
		if (token) {
			const decoded: JwtPayload = jwt.verify(
				token,
				this.JWT_SECRET,
			) as JwtPayload;

			const hashedPassword = await this.hashPassword(newPassword);

			await this.db.user.update({
				where: { id: decoded.user },
				data: { password: hashedPassword },
			});
		}
		throw new Error("Invalid token");
	}
	async checkTokenValid({ token }: { token: string }): Promise<void> {
		try {
			jwt.verify(token, this.JWT_SECRET) as JwtPayload;
		} catch (error: unknown) {
			this.logger.error("Error with auth request: %0", error);
			if (error as TokenExpiredError) {
				throw new Error("Token is expired");
			}
			if (error instanceof Error) {
				throw new Error("Token is invalid");
			}
		}
	}

	private comparePassword(password: string, hashed: string): Promise<boolean> {
		return bcrypt.compare(password, hashed);
	}

	private async returnToken(
		user: User,
		JWT_SECRET: string,
	): Promise<{
		token: string;
	}> {
		const userWorkspaces: Workspace[] = await this.db.userWorkspace
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
		return { token };
	}

	private async hashPassword(password: string): Promise<string> {
		return new Promise((resolve, reject) => {
			bcrypt.genSalt(10, (error, salt) => {
				if (error) {
					reject(error);
				}
				bcrypt.hash(password, salt, (error, hash) => {
					if (error) {
						reject(error);
					}
					resolve(hash);
				});
			});
		});
	}
}
