import { joinWorkspace } from "@/utils/joinWorkspace";
import type { PrismaClient } from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import type { AuthRpc, Register, RegisterReturn } from "./types";

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
	async register({
		email,
		name,
		username,
		externalId,
		inviteToken,
	}: Register): Promise<RegisterReturn> {
		this.logger.info("Registering user %s", email);
		// Creating the user
		const user = await this.db.user.create({
			data: {
				name,
				username,
				email,
				externalId,
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

		return { user, message: "Registered Successfully", variant: "default" };
	}
}
