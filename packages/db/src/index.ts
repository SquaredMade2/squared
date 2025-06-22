/** biome-ignore-all lint/performance/noReExportAll: This is needed */
/** biome-ignore-all lint/style/noProcessEnv: This is an entrypoint */
import { neonConfig, Pool } from "@neondatabase/serverless";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle, type NeonQueryResultHKT } from "drizzle-orm/neon-serverless";
import type { PgTransaction } from "drizzle-orm/pg-core";
import ws from "ws";

// biome-ignore lint/performance/noNamespaceImport: This is needed to type the DBClient
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

export const createDb = ({
	databaseUrl,
	isRemote = false,
}: {
	databaseUrl?: string;
	isRemote?: boolean;
}) => {
	// Function to create the database connection
	const config = {
		databaseUrl:
			databaseUrl ||
			process.env.DATABASE_URL ||
			"postgres://squared:squared@localhost:5432/squared-test?sslmode=disable",
		localDb: isRemote ? false : process.env.LOCAL_DB,
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
		neonConfig.useSecureWebSocket = true;
	}
	const pool = new Pool({ connectionString: config.databaseUrl });
	return drizzle({ client: pool, schema });
};
