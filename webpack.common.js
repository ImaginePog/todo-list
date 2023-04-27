const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: {
		index: "./src/index.js",
	},
	plugins: [new MiniCssExtractPlugin({ filename: "main.[contenthash].css" })],
	module: {
		rules: [
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
				generator: {
					filename: "./images/[name].[contenthash].[ext]",
				},
			},
			{
				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
				type: "asset/resource",
				generator: {
					filename: "./fonts/[name].[contenthash].[ext]",
				},
			},
		],
	},
};
