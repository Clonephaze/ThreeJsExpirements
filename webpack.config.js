const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { server } = require('typescript');

module.exports = {
  entry: './src/ts/main.ts',
  output: {
    filename: 'bundle.js', // Keep JS in the 'dist' folder
    path: path.resolve(__dirname, 'dist'), // Ensure this is the project root
    clean: true, // Clean before build
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss', '.html'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'dist/assets/[name][ext]', // Assets go to 'dist/assets'
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'dist/assets/fonts/[name][ext]', // Fonts in 'dist/assets/fonts'
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/html/index.html',
      filename: path.resolve(__dirname, 'index.html'), // Ensures index.html is in the root
    }),
  ],
  devtool: 'source-map',
  mode: 'development', // 'development' or 'production'
  devServer: {
    static: {
      directory: path.join(__dirname), // Serve files from the 'dist' directory
    },
    hot: true,
    host: 'local-ipv4',
    server: 'https',
    compress: true, // Enable gzip compression
    port: 9000, // Port to run the server on
    historyApiFallback: true, // Fallback to index.html for Single Page Applications
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
};
