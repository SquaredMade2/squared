import { Pool, neonConfig } from "@neondatabase/serverless";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { type NeonQueryResultHKT, drizzle } from "drizzle-orm/neon-serverless";
import type { PgTransaction } from "drizzle-orm/pg-core";
import ws from "ws";
import * as schema from "./schema";
export * from "drizzle-orm";
export * from "./schema";
export type DBClient = ReturnType<typeof drizzle<typeof schema>>;
export type TransactionClient = PgTransaction<
	NeonQueryResultHKT,
	typeof schema,
	ExtractTablesWithRelations<typeof schema>
>;
declare global {
	var cachedDb: DBClient;
}

export const createDb = ({ databaseUrl, defaultLocalValue = true }: { databaseUrl?: string, defaultLocalValue?: boolean }) => {
	// Function to create the database connection
	const config = {
		databaseUrl:
			databaseUrl ||
			process.env.DATABASE_URL ||
			"postgres://squared:squared@localhost:5432/squared-test?sslmode=disable",
		localDb: defaultLocalValue ? process.env.LOCAL_DB : false,
		nodeEnv: process.env.NODE_ENV || "test",
	};

	neonConfig.webSocketConstructor = ws;

	if (config.localDb) {
		neonConfig.fetchEndpoint = (host) => {
			const [protocol, port] = ["http", 4444];
			return `${protocol}://${host}:${port}/sql`;
		};
		neonConfig.useSecureWebSocket = false;
		neonConfig.wsProxy = (host) => `${host}:4444/v1`;
		const parsedDatabaseURL = new URL(config.databaseUrl);
		parsedDatabaseURL.host = "db.localtest.me"; // Magic string here 🤷
		config.databaseUrl = parsedDatabaseURL.toString();
	} else {
		neonConfig.useSecureWebSocket = true
	}
	const pool = new Pool({ connectionString: config.databaseUrl });
	return drizzle({ client: pool, schema });
};
