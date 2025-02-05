import { Pool, neonConfig, neon } from "@neondatabase/serverless";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { type NeonQueryResultHKT, drizzle } from "drizzle-orm/neon-serverless";
import type { PgTransaction } from "drizzle-orm/pg-core";
import ws from "ws";
import { drizzle as driz } from "drizzle-orm/neon-http";
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

export const createRemoteDb = ({databaseUrl}: {databaseUrl: string}) => {
	console.log('DATABASE URL: ', databaseUrl)
	const sql = neon(databaseUrl);
	return driz({client: sql, schema});
}

export const createDb = ({ databaseUrl, isLocal }: { databaseUrl?: string, isLocal?: boolean }) => {
	// Function to create the database connection
	const config = {
		databaseUrl:
			databaseUrl ||
			process.env.DATABASE_URL ||
			"postgres://squared:squared@localhost:5432/squared-test?sslmode=disable",
		localDb: isLocal !== undefined ? isLocal : ( process.env.LOCAL_DB || false),
		nodeEnv: process.env.NODE_ENV || "test",
	};

	if (config.localDb) {
		neonConfig.fetchEndpoint = (host) => {
			const [protocol, port] = ["http", 4444];
			return `${protocol}://${host}:${port}/sql`;
		};
		neonConfig.useSecureWebSocket = false;
		neonConfig.wsProxy = (host) => `${host}:4444/v1`;
		neonConfig.webSocketConstructor = ws;
		const parsedDatabaseURL = new URL(config.databaseUrl);
		parsedDatabaseURL.host = "db.localtest.me"; // Magic string here 🤷
		config.databaseUrl = parsedDatabaseURL.toString();
	}
	const pool = new Pool({ connectionString: config.databaseUrl });
	return drizzle({ client: pool, schema });
};
