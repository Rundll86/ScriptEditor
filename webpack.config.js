const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require("webpackbar");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const path = require("path");
/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "[name].dist.js",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.vue$/i,
                use: "vue-loader"
            },
            {
                test: /\.css$/i,
                use: ["vue-style-loader", "css-loader"]
            },
            {
                test: /\.ts$/i,
                use: "ts-loader",
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./templates/index.html",
            filename: "index.html"
        }),
        new WebpackBar({
            name: "Page",
            color: "green"
        }),
        new FriendlyErrorsWebpackPlugin({
            clearConsole: true
        }),
        new VueLoaderPlugin()
    ],
    devServer: {
        static: ".",
        compress: true,
        port: 19198,
        client: {
            logging: "none"
        }
    },
    stats: "none"
};