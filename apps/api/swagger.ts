import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import schemas from "./schemas";

// Function to recursively scan for index.docs.ts files
function scanForDocs(dir: string): Record<string, any> {
	let docs: Record<string, any> = {};
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			const subDocs = scanForDocs(filePath);
			docs = { ...docs, ...subDocs };
		} else if (file === "index.docs.ts") {
			const route = dir
				.replace(/^.*\/src\/api/, "")
				.replace(/\[(\w+)\]/g, "{$1}");
			const routeDocs = require(filePath).default;
			docs[route] = routeDocs;
		}
	}

	return docs;
}

// Aggregate documentation from all index.docs.ts files
const aggregateDocs = () => {
	const apiDir = path.join(__dirname, "src", "api");
	return scanForDocs(apiDir);
};

// Generate Swagger options
const generateSwaggerOptions = () => {
	const docs = aggregateDocs();

	return {
		definition: {
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
};

// Generate Swagger specification
const swaggerSpec = swaggerJSDoc(generateSwaggerOptions());

// Setup Swagger
export const setupSwagger = (router: Router) => {
	router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
