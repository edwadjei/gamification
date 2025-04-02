import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { koaSwagger } from 'koa2-swagger-ui';
import swaggerJsdoc from 'swagger-jsdoc';
import { initializeDatabase } from './config/db';
import routes from './routes';
import { ValidationError } from './middleware/error-handlers/validation-error';
import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Swagger configuration
const swaggerOptions = {
  definition: {
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
  },
  apis: [
    path.resolve(__dirname, './controllers/*.ts'),
    path.resolve(__dirname, './models/*.ts'),
    path.resolve(__dirname, './routes/*.ts'),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = new Koa();
const PORT = process.env.PORT || 3000;

// Global error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    if (err instanceof ValidationError) {
      // Handle validation errors
      ctx.status = err.status;
      ctx.body = {
        error: 'Validation Error',
        message: err.message,
      };
    } else {
      // Handle other errors
      console.error('Unhandled error:', err);
      ctx.status = err.status || 500;
      ctx.body = {
        error: err.name || 'Server Error',
        message: err.message || 'Internal Server Error',
      };
    }

    // Emit error event
    ctx.app.emit('error', err, ctx);
  }
});

// Middlewares
app.use(cors());
app.use(bodyParser());

// Swagger endpoint to get the OpenAPI spec as JSON
app.use(async (ctx, next) => {
  if (ctx.path === '/api/swagger.json') {
    ctx.body = swaggerSpec;
    return;
  }
  await next();
});

// Setup Swagger UI
app.use(
  koaSwagger({
    routePrefix: '/api/docs',
    swaggerOptions: {
      spec: swaggerSpec as Record<string, unknown> | undefined,
    },
  }),
);

// Register all routes
routes.forEach((router) => {
  app.use(router.routes());
  app.use(router.allowedMethods());
});

// Start the server
const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(
        `API Documentation available at http://localhost:${PORT}/api/docs`,
      );
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
