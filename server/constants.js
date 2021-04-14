require('dotenv').config();

export const dbServer = process.env.DB_SERVER || 'localhost';
export const dbName = process.env.DB_NAME || 'fraud-app-detection';
export const workerConnectionDetails = {
  pkg: 'ioredis',
  host: 'localhost',
  password: null,
  port: 6379,
  database: 0,
  namespace: 'demystify_app',
};
export const address = process.env.ADDRESS || 'localhost';
export const port = process.env.PORT || 6767;
