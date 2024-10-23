import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Router } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import schemas from "./schemas";

const API_DIR = path.join(__dirname, "src", "api");

// Function to recursively scan for index.docs.ts files
async function scanForDocs(dir: string): Promise<Record<string, string>> {
	let docs: Record<string, string> = {};
	const files = await fs.readdir(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = await fs.stat(filePath);

		if (stat.isDirectory()) {
			const subDocs = await scanForDocs(filePath);
			docs = { ...docs, ...subDocs };
		} else if (file === "index.docs.ts") {
			const routeDocs = require(filePath).default;
			docs = { ...docs, ...routeDocs };
		}
	}

	return docs;
}

// Aggregate documentation from all index.docs.ts files
async function aggregateDocs(): Promise<Record<string, string>> {
	console.log("Aggregating API documentation...");
	const docs = await scanForDocs(API_DIR);
	console.log("API documentation aggregated.");
	return docs;
}

// Generate Swagger options
async function generateSwaggerOptions() {
	const docs = await aggregateDocs();

	return {
		swaggerDefinition: {
			openapi: "3.0.0",
			info: {
				title: "API Documentation",
				version: "1.0.0",
			},
			paths: docs,
			components: {
				schemas,
			},
		},
		apis: [],
	};
}

// Setup Swagger
export const setupSwagger = async (router: Router) => {
	const swaggerSpec = await swaggerJSDoc(await generateSwaggerOptions());

	router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	router.get("/api-docs.json", (_, res) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});
};
