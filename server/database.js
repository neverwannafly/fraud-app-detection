/* eslint-disable no-console */
import mongoose from 'mongoose';
import { dbServer, dbName } from './constants';

class Database {
  constructor() {
    this.client = mongoose;
    this.connect();
  }

  connect() {
    this.client.connect(`mongodb://${dbServer}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).catch((err) => {
      console.error(`Database connection error\n${err}`);
    });
  }

  getConnection() {
    return this.client.connection;
  }

  getClient() {
    return this.client;
  }
}

const database = new Database();

export default database;
