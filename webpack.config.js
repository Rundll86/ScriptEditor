const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require("webpackbar");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
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
                use: {
                    loader: "vue-loader",
                    options: {
                        defaultScriptLang: 'ts'
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ["vue-style-loader", "css-loader"]
            },
            {
                test: /\.ts$/i,
                use: {
                    loader: "ts-loader",
                    options: {
                        appendTsSuffixTo: [/\.vue$/i],
                        transpileOnly: true
                    }
                },
                exclude: /\.d\.ts$/i
            },
            {
                test: /\.d\.ts$/i,
                use: "null-loader"
            },
            {
                test: /\.png$/i,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: Infinity
                    }
                }
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
        new VueLoaderPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: "./public",
                    to: "."
                }
            ]
        })
    ],
    devServer: {
        static: "public",
        compress: true,
        port: 8080,
        client: {
            logging: "none"
        }
    },
    stats: "none",
    performance: {
        maxAssetSize: Infinity
    }
};