import { joinWorkspace } from "@/utils/joinWorkspace";
import { sendMail } from "@/utils/mail";
import { passwordResetTemplate, verifyEmailTemplate } from "@/utils/templates";
import type { PrismaClient, User, Workspace } from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload, TokenExpiredError } from "jsonwebtoken";
import type {
	AuthRpc,
	CheckTokenValidReturn,
	Login,
	OauthLogin,
	Register,
	RegisterReturn,
	UserToken,
} from "./types";

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
		this.logger.info("Logging in user %s", email);
		// Check if the user exists
		const user: User | null = await this.db.user.findUnique({
			where: { email },
		});

		if (!user) {
			this.throwError("No user found, please register.");
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
			this.throwError(
				"Your email is not verified. A verification link has been sent to your email.",
			);
		}

		if (!user.password) this.throwError("This user has no password.");

		const passwordMatch = await this.comparePassword(password, user.password);

		if (!passwordMatch) this.throwError("Incorrect Password");

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
		this.logger.info("Logging in user %s", email);
		let user: User | null = await this.db.user.findUnique({
			where: { email },
		});
		if (!user) {
			this.logger.info("Creating new user %s", email);
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
			this.throwError(
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
	}: Register): Promise<RegisterReturn> {
		this.logger.info("Registering user %s", email);
		const existingUser = await this.db.user.findUnique({
			where: { email },
		});

		if (existingUser) this.throwError("This email is already registered.");

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
			this.logger.info("Joining workspace with invite token %s", inviteToken);
			const { message, variant, status } = await joinWorkspace(
				inviteToken,
				user.id,
				this.db,
			);
			if (status === 200) {
				const newUser = await this.db.user.findUnique({
					where: { id: user.id },
				});
				return { user: newUser, message, variant };
			}
			return { user, message, variant };
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
			this.throwError(
				`Error sending email: ${error instanceof Error && error.message}`,
			);
		}
		return { user, message: "Whot", variant: "default" };
	}
	async verifyUser({ token }: { token: string }): Promise<User | null> {
		this.logger.info("Verifying user with token %s", token);
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
	async resetPasswordEmail({
		email,
	}: { email: string }): Promise<{ success: boolean }> {
		this.logger.info("Resetting password for %s", email);
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
				return { success: true };
			} catch (error) {
				this.throwError(
					`Error sending email: ${error instanceof Error && error.message}`,
				);
			}
		}
		throw new Error("Email not found");
	}
	async resetPassword({
		token,
		newPassword,
	}: { token: string; newPassword: string }): Promise<{ success: boolean }> {
		this.logger.info("Resetting password with token %s", token);
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
			return { success: true };
		}
		this.throwError("Invalid token");
	}
	async checkTokenValid({
		token,
	}: { token: string }): Promise<CheckTokenValidReturn> {
		this.logger.info("Checking if token is valid");
		try {
			jwt.verify(token, this.JWT_SECRET) as JwtPayload;
		} catch (error: unknown) {
			this.logger.error("Error with auth request: %0", error);
			let err: string | undefined;
			if (error instanceof TokenExpiredError || error instanceof Error) {
				err = error.name;
			}
			if (err === "TokenExpiredError" || err === "JsonWebTokenError") {
				const decoded: JwtPayload = jwt.decode(token) as JwtPayload;
				const user = await this.db.user.findUnique({
					where: { id: decoded.user },
				});
				if (!user) throw new Error("User not found");
				return {
					email: user.email,
					message: "Token is expired or invalid",
				};
			}
			throw error;
		}
		return null;
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

	private throwError(message: string): never {
		this.logger.error("Error: %s", message);
		throw new Error(message);
	}
}
