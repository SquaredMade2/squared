import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express, Router } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
  },
  apis: ['./**/*.ts'], // Adjust this to match your route files location
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (router: Router) => {
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
