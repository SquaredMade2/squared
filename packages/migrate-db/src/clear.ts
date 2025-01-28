import "dotenv/config";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

const db = drizzle(client, { schema });

async function clearDb(): Promise<void> {
	try {
		await client.connect();
		console.log("Connected to the database");

		await client.query("BEGIN");

		// Drop all tables
		const dropTablesQuery = sql`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `;

		await db.execute(dropTablesQuery);
		console.log("All tables have been dropped");

		// Drop all types
		const dropTypesQuery = sql`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) LOOP
          EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
        END LOOP;
      END $$;
    `;

		await db.execute(dropTypesQuery);
		console.log("All custom types have been dropped");

		await client.query("COMMIT");
		console.log("All operations committed successfully");
	} catch (error) {
		await client.query("ROLLBACK");
		console.error("Error clearing database:", error);
	} finally {
		await client.end();
		console.log("Disconnected from the database");
	}
}

// Run the clearDb function
clearDb().catch((error) => {
	console.error("Unhandled error:", error);
	process.exit(1);
});
