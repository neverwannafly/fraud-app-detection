require('dotenv').config();

export const dbServer = process.env.DB_SERVER || 'localhost';
export const dbName = process.env.DB_NAME || 'fraud-app-detection';
