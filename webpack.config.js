const path 								= require('path');
const webpack							= require('webpack');
const htmlWebpackPlugin 	= require('html-webpack-plugin');
const autoprefixer 				= require('autoprefixer');

module.exports = {
	devtool: 'cheap-eval-source-map',
	entry: [
		'webpack-hot-middleware/client',
		'./src/index'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/dist/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				loaders: ['babel'],
				include: path.join(__dirname, 'src')
			},
			{
				test: /\.css$/,
				loader:'style!css!'
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader?limit=100000000000"
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader?limit=10000000000"
			},
			{
				test: /\.(png|jpg)$/,
				loader: 'url-loader?limit=8192'
			}
		]
	},
	postcss: function() {
		return [autoprefixer]
	}
};
