/* eslint-disable no-console */
import express from 'express';

import webpack from 'webpack';
import middleware from 'webpack-dev-middleware';
import history from 'connect-history-api-fallback';
import webpackConfig from '../webpack.config.dev';

import database from './database';

const connection = database.getConnection();
connection.once('open', () => console.log('connected to database!'));

const app = express();
const port = process.env.PORT || 6767;

const compiler = webpack(webpackConfig);

app.use(history());
app.use(
  middleware(compiler, {
    publicPath: '/',
  }),
);

app.listen(port, () => console.log(`Listening on: http://localhost:${port}`));
