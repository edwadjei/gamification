import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerOptions } from 'koa2-swagger-ui';
import path from 'path';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Gamification API',
    version: '1.0.0',
    description: 'API for gamification system with score calculation',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1',
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      },
    },
  },
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Path to the API docs
  apis: [
    path.resolve(__dirname, '../controllers/*.ts'),
    path.resolve(__dirname, '../models/*.ts'),
    path.resolve(__dirname, '../routes/*.ts'),
  ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Swagger UI options
export const swaggerUIOptions: SwaggerOptions = {
  title: 'Gamification API',
  swaggerOptions: {
    spec: swaggerSpec,
  },
  routePrefix: '/api/docs',
};

// Export the swagger spec for the JSON endpoint
export const getSwaggerSpec = () => swaggerSpec;
