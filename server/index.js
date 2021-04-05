import express from 'express';
import path from 'path';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../webpack.config.dev'

const app = express();
const port = process.env.PORT || 6767;

const distDirectory = path.join(__dirname, '../dist');
const htmlFile = path.join(distDirectory, 'index.html');

app.use(webpackMiddleware(webpack(webpackConfig)));

app.get('/', (_, res) => {
  res.sendFile(htmlFile);
});

app.listen(port, () => console.log(`Listening on: http://localhost:${port}`));