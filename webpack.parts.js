const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');

exports.inspectLoader = {
	loader: 'inspect-loader',
	options: {
		callback(inspect) {
			console.log(inspect.arguments);
		},
	},
};

exports.devServer = ({ host, port } = {}) => ({
	devServer: {
		historyApiFallback: true,
		stats: 'errors-only',
		host, // Defaults to `localhost`
		port, // Defaults to 8080
		overlay: {
			errors: true,
			warnings: true,
		},
	},
});

exports.lintJavaScript = ({ include, exclude, options }) => ({
	module: {
		rules: [
			{
				test: /\.js$/,
				include,
				exclude,
				enforce: 'pre',

				loader: 'eslint-loader',
				options,
			},
		],
	},
});

exports.loadCSS = ({ include, exclude } = {}) => ({
	module: {
		rules: [
			{
				test: /\.css$/,
				include,
				exclude,

				use: ['style-loader', 'css-loader'],
			},
		],
	},
});

exports.loadSCSS = ({ include, exclude } = {}) => ({
	module: {
		rules: [
			{
				test: /\.scss$/,
				include,
				exclude,

				use: ['style-loader', 'css-loader', exports.autoprefix(), 'resolve-url-loader', 'sass-loader?sourceMap'],
			},
		],
	},
});

exports.extractCSS = ({ include, exclude, use }) => {
	const plugin = new ExtractTextPlugin({
		filename: '[name].css',
	});

	return {
		module: {
			rules: [
				{
					test: /\.css$/,
					include,
					exclude,
					use: plugin.extract({
						use,
						fallback: 'style-loader',
					}),
				},
				{
					test: /\.scss$/,
					include,
					exclude,
					use: plugin.extract({
						use: use.concat(['resolve-url-loader', 'sass-loader?sourceMap']),
						fallback: 'style-loader',
					})
				}
			],
		},
		plugins: [ plugin ]
	};

};

exports.autoprefix = () => ({
	loader: 'postcss-loader',
	options: {
		plugins: () => ([
			require('autoprefixer')
		]),
	},
});


exports.lintSCSS = ({ include, exclude }) => ({
	module: {
		rules: [
			{
				test: /\.scss$/,
				include,
				exclude,
				enforce: 'pre',
				loader: 'postcss-loader',
				options: {
					syntax: 'postcss-scss',
					plugins: () => ([
						require('stylelint')({
							ignoreFiles: 'node_modules/**/*.scss'
						}),
					]),
				},
			},
		],
	},
});

exports.purifyCSS = ({ paths }) => ({
	plugins: [
		new PurifyCSSPlugin({ paths }),
	],
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
	module: {
		rules: [
			{
				test: /\.(png|jpg|svg)$/,
				include,
				exclude,

				use: {
					loader: 'url-loader',
					options,
				},
			},
		],
	},
});

exports.loadFonts = ({ include, exclude, options } = {}) => ({
	module: {
		rules: [
			{
				// Capture eot, ttf, woff, and woff2
				test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				include,
				exclude,

				use: {
					loader: 'url-loader',
					options,
				},
			},
		],
	},
});

exports.loadJavaScript = ({ include, exclude }) => ({
	module: {
		rules: [
			{
				test: /\.js$/,
				include,
				exclude,

				loader: 'babel-loader',
				options: {
					// Enable caching for improved performance during
					// development.
					// It uses default OS directory by default. If you need
					// something more custom, pass a path to it.
					// I.e., { cacheDirectory: '<path>' }
					cacheDirectory: true,
				},
			},
		],
	},
});