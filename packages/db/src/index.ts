import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
export * from "./schema";
export * from "drizzle-orm";
import ws from "ws";

export type DBClient = ReturnType<typeof drizzle<typeof schema>>;
declare global {
	var cachedDb: DBClient;
}

// Function to create the database connection
export const createDb = ({ databaseUrl }: { databaseUrl?: string }) => {
	const config = {
		databaseUrl:
			databaseUrl ||
			process.env.DATABASE_URL ||
			"postgres://squared:squared@localhost:5432/store-manager?sslmode=disable",
		localDb: process.env.LOCAL_DB || "true",
		nodeEnv: process.env.NODE_ENV || "test",
	};
	let db: DBClient;

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

	if (config.nodeEnv === "production") {
		// In production, create a new connection for each request
		const sql = neon(config.databaseUrl);
		db = drizzle(sql, { schema });
	} else {
		// In development, reuse the connection
		if (!global.cachedDb) {
			const sql = neon(config.databaseUrl);
			global.cachedDb = drizzle(sql, { schema });
		}
		db = global.cachedDb;
	}

	return db;
};
