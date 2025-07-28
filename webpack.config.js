const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/index.ts', // точка входа
	devtool: 'inline-source-map', // для отладки
	module: {
		rules: [
			{
				test: /\.tsx?$/, // обработка файлов .ts и .tsx
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/, // обработка CSS
				use: ['style-loader', 'css-loader']
			}
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'bundle.js', // итоговый бандл
		path: path.resolve(__dirname, 'dist'), // директория для сборки
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/index.html'),
		})
	],
	devServer: {
		static: './dist', // директория для dev-сервера
		port: 3000 // порт
	}
};