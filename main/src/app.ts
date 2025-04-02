import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { initializeDatabase } from './config/db';
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
    console.error('Unhandled error:', err);
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || 'Internal Server Error',
    };
  }
});

// Middlewares
app.use(cors());
app.use(bodyParser());

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
