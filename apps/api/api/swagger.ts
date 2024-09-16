import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Router } from "express";
import docs from "./docs";

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API Documentation",
			version: "1.0.0",
		},
		...docs,
	},
	apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (router: Router) => {
	router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
