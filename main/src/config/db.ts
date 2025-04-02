import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Element, Score } from '../models';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as mysql from 'mysql2/promise';

// Configure the main DataSource
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'gamification',
  synchronize: true,
  logging: false,
  entities: [Element, Score],
  namingStrategy: new SnakeNamingStrategy(),
});

// Function to create the database if it doesn't exist
async function createDatabaseIfNotExists() {
  const dbName = process.env.DB_NAME || 'gamification';
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306');
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || 'password';

  // Create a connection to the MySQL server
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });

  try {
    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' created or already exists`);
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    // Close the connection
    await connection.end();
  }
}

// Initialize database
export const initializeDatabase = async () => {
  try {
    // First ensure the database exists
    await createDatabaseIfNotExists();

    // Then initialize the TypeORM connection
    await AppDataSource.initialize();
    console.log('Database connection initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};
