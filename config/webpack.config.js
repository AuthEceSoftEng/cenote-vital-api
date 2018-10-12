const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const resolve = dir => path.join(__dirname, '../', dir);

const isDev = process.env.NODE_ENV !== 'production';

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
	template: resolve('client/index.html'),
	filename: 'index.html',
	inject: 'body',
});

const MiniCssExtractPluginConfig = new MiniCssExtractPlugin({
	filename: isDev ? '[name].css' : '[name].[hash].css',
	chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
});

const FaviconsWebpackPluginConfig = new FaviconsWebpackPlugin({
	logo: resolve('client/assets/icons/favicon.ico'),
	prefix: 'icons/',
	emitStats: false,
	statsFilename: 'faviconstats.json',
	persistentCache: false,
	inject: true,
	icons: {
		android: false,
		appleIcon: false,
		appleStartup: false,
		coast: false,
		favicons: true,
		firefox: false,
		opengraph: false,
		twitter: false,
		yandex: false,
		windows: false,
	},
});

const CleanWebpackPluginConfig = new CleanWebpackPlugin(['dist'], { root: resolve('.') });

module.exports = {
	devServer: {
		contentBase: './dist',
		historyApiFallback: true,
		inline: true,
	},
	watchOptions: { poll: true },
	entry: [
		'./client/styles/index.scss',
		'./client/assets/index.js',
		'./client/index.js',
	],
	output: {
		filename: isDev ? '[name].js' : '[name].[hash].js',
		path: resolve('dist'),
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [resolve('client')],
			},
			{
				test: /\.css$/,
				use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.scss$/i,
				use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.less$/i,
				use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
			},
			{
				test: /\.(jpe?g|png|gif)$/i,
				use: [
					{
						loader: 'file-loader',
						options: { name: 'images/[name].[ext]' },
					},
					{
						loader: 'image-webpack-loader',
						query: {
							optipng: { optimizationLevel: 7 },
							mozjpeg: { progressive: true },
							gifsicle: { interlaced: false },
							pngquant: { quality: '75-90', speed: 3 },
						},
					},
				],
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'url-loader',
				options: {
					name: 'fonts/[name].[ext]',
					limit: 8192,
					mimetype: 'application/font-woff',
				},
			},
			{
				test: /\.svg(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader',
				options: { name: 'icons/[name].[ext]' },
			},
			{
				test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader',
				options: { name: 'fonts/[name].[ext]' },
			},
		],
	},
	plugins: [
		HtmlWebpackPluginConfig,
		MiniCssExtractPluginConfig,
		FaviconsWebpackPluginConfig,
		CleanWebpackPluginConfig,
	],
};
