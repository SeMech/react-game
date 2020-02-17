const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const os = require('os');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');

const config = {
    entry: './src/index.jsx',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    resolve: {
        extensions: [ '.jsx', '.js' ]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: nodeModulesPath,
            },
            {
                test: /\.(jpg|jpeg|png|svg)$/,
                loader: `file-loader`,
                options: {
                    outputPath: 'images',
                    name: '[md5:hash:hex:30].[ext]',
                },
            },
            {
                test: /\.(mp4)$/,
                loader: `file-loader`,
                options: {
                    outputPath: 'videos',
                    name: '[md5:hash:hex:30].[ext]',
                },
            },
            {
                test: /\.(ttf|otf|woff|woff2)$/,
                loader: `file-loader`,
                options: {
                    outputPath: 'fonts',
                    name: '[md5:hash:hex:30].[ext]',
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
            filename: 'index.html',
            hash: true,
        }),
        new CopyPlugin([{
            from: 'static',
            to: '',
        }]),
        new webpack.DefinePlugin({
            ADDRESS: JSON.stringify(
                os.networkInterfaces().wlo1
                    ? os.networkInterfaces().wlo1[0].address
                    : '127.0.0.1',
            ),
        }),
    ],
    devServer: {
        contentBase: false,
        index: 'index.html',
        historyApiFallback: true,
        open: false,
        host: '0.0.0.0',
    },
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'source-map';
    }

    return config;
};
