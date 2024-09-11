const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
	entry: './src/ts/main.ts',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
	resolve: {
		extensions: ['.ts', '.js', '.scss', '.html', '.json'],
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
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
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader'
				],
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
					filename: 'dist/assets/[name][ext]',
				},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'dist/assets/fonts/[name][ext]',
				},
			},
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'css-minimizer-webpack-plugin']
			},
			{
				test: /\.json$/,
				type: 'asset/resource'
			}
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/html/index.html',
			filename: path.resolve(__dirname, 'index.html'),
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css",
		}),
	],
	// devtool: 'source-map',
	mode: 'production',
	devServer: {
		static: {
			directory: path.join(__dirname),
		},
		hot: true,
		host: 'local-ipv4',
		server: 'https',
		compress: true,
		port: 9000,
		historyApiFallback: true,
		watchFiles: ['src/**/*'],
	},
	watch: true,
	watchOptions: {
		ignored: /node_modules/,
	},
};
