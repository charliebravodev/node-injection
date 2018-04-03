var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var Uglify = require("uglifyjs-webpack-plugin");
var DtsBundlePlugin = require('./utils/webpack/dts-bundle');
var nodeExternals = require('webpack-node-externals');
var rimraf = require('rimraf');

rimraf.sync('dist/**/**');

// Our Webpack Defaults
var sharedConfig = {
	target: 'node',
	externals: [nodeExternals()],
	module: {
		loaders: [
			{test: /\.ts$/, loaders: ['ts-loader'], exclude: /node_modules/}
		]
	},
	plugins: [
		new Uglify({sourceMap: true}),
	],
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: '[name].js',
		sourceMapFilename: '[name].map',
		libraryTarget: 'commonjs'
	},
	devtool: 'source-map',
	resolve: {
		extensions: ['.ts', '.js']
	}
};

var webpackConfig = Object.assign({}, sharedConfig);
webpackConfig.entry = {
	'node-injection': './src/index.ts',
};
webpackConfig.plugins = webpackConfig.plugins.concat(!!process.env.DTS ? [new DtsBundlePlugin()] : []);

module.exports = webpackConfig;
