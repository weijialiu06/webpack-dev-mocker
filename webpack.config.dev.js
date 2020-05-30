const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const mocker = require('./src/index');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: {
    path: path.resolve(__dirname, 'example/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'demo.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'example'),
    compress: true,
    open: true,
    before(app) {
      mocker(app, {
        proxy: {
          '/sug/': 'http://suggest.taobao.com',
        },
        dataPath: path.resolve(__dirname, '__mock__'),
      });
    },
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
        include: [/node_modules\/tinify/],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  plugins: [
    //  new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: './example/index.html',
    }),
  ],
};
