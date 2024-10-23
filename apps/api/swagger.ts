import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import schemas from "./schemas";

// Function to recursively scan for index.docs.ts files
function scanForDocs(dir: string): Record<string, string> {
	let docs: Record<string, string> = {};
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			const subDocs = scanForDocs(filePath);
			docs = { ...docs, ...subDocs };
		} else if (file === "index.docs.ts") {
			const routeDocs = require(filePath).default;
			docs = { ...docs, ...routeDocs };
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
};

// Generate Swagger specification
const swaggerSpec = swaggerJSDoc(generateSwaggerOptions());

// Setup Swagger
export const setupSwagger = (router: Router) => {
	router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

// Preload documentation
const preloadDocs = () => {
	console.log("Preloading API documentation...");
	aggregateDocs();
	console.log("API documentation preloaded.");
};

// Call preloadDocs immediately
preloadDocs();
