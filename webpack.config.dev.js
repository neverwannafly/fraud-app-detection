import path from 'path';
import HtmlWebPackPlugin from 'html-webpack-plugin';

const htmlPlugin = new HtmlWebPackPlugin({
  template: path.join(__dirname, "client/index.html"), 
  filename: "./index.html"
});

export default {
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "fraud-app-detection.js",
  },
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [htmlPlugin],
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        },
      },
    }, {
      test: /\.s?css$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    }, {
      test: /\.(png|svg|jpg|gif)$/,
      loader: "file-loader",
      options: { name: '/static/[name].[ext]' }
    }, {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    }]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  }
}