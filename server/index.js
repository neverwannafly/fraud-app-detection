/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import webpack from 'webpack';
import middleware from 'webpack-dev-middleware';
import history from 'connect-history-api-fallback';
import webpackConfig from '../webpack.config.dev';
import apis from './api';

import { port, address } from './constants';
import { bindApisToApp, availableRoutes } from './utils';
import database from './database';

const connection = database.getConnection();
connection.once('open', () => console.log('connected to database!'));

const app = express();

const compiler = webpack(webpackConfig);

// Register all routes
bindApisToApp(app, apis);
console.log(availableRoutes(app));

app.use(history());
app.use(
  middleware(compiler, {
    publicPath: '/',
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/assets/icons')));

app.listen(
  port,
  address,
  () => console.log(`Listening on: http://${address}:${port}`),
);
