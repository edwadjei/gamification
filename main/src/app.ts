import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { initializeDatabase } from './config/db';
import routes from './routes';
import { ValidationError } from './middleware/error-handlers/validation-error';
import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config();

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
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
