const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		index: path.resolve(__dirname, 'blocks/index.js'),
		'front-end': path.resolve(__dirname, 'blocks/front-end.js'),
	},
	output: {
		...defaultConfig.output,
		path: path.resolve(__dirname, 'assets/js'),
		filename: '[name].js',
	},
};