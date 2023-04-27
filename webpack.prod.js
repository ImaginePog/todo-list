const path = require("path");

const common = require("./webpack.common");
const { merge } = require("webpack-merge");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
	mode: "production",
	optimization: {
		minimizer: [
			new HtmlWebpackPlugin({
				template: "./src/index.html",
				minify: {
					removeAttributeQuotes: true,
					collapseWhitespace: true,
					removeComments: true,
				},
			}),
			new TerserPlugin(),
			new CssMinimizerPlugin(),
		],
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
		],
	},
	output: {
		filename: "main.[contenthash].js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
});
