import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

const db = drizzle({ client });

async function clearDb(): Promise<void> {
	const query = sql<string>`SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const { rows: tables } = (await db.execute(query)) as unknown as any;
	console.log("Tables: ", tables);

	for (const table of tables) {
		const query = sql.raw(`TRUNCATE TABLE ${table.table_name} CASCADE;`);
		await db.execute(query); // Truncate (clear all the data) the table
	}
	console.log("Successfully Cleared Database");
}

clearDb();
