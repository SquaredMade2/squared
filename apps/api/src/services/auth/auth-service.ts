import { type DBClient, eq, usersTable } from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import type { AuthRpc, Register, RegisterReturn } from "./types";

export class AuthService implements AuthRpc {
	private readonly db: DBClient;
	private readonly logger: Logger;
	constructor(db: DBClient) {
		this.db = db;
		this.logger = createCustomLogger("auth");
	}
	async register({
		email,
		name,
		username,
		externalId,
	}: Register): Promise<RegisterReturn> {
		this.logger.info("Registering user %s", email);

		const existingUser = await this.checkExistingUser(email);
		if (existingUser) {
			return {
				user: existingUser,
				message: "User already exists",
			};
		}

		// Creating the user
		const [user] = await this.db
			.insert(usersTable)
			.values({
				name,
				username,
				email,
				externalId,
			})
			.returning();

		return { user, message: "Registered Successfully", variant: "default" };
	}

	private async checkExistingUser(email: string) {
		const [user] = await this.db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email));
		if (user) {
			this.logger.info("User %s already exists", email);
			return user;
		}
		return null;
	}
}
