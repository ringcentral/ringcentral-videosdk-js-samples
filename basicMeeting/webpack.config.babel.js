import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

export default {
    entry: {
        index: './src/index.tsx',
    },
    output: {
        publicPath: '/',
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.jsx?$/,
                 exclude: /node_modules/,
                 use: {
                     loader: 'babel-loader',
                     options: {
                         cacheDirectory: true,
                     },
                 },
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        modules: 'auto',
                                        loose: false,
                                        targets: {
                                            node: 'current',
                                        },
                                    },
                                ],
                                '@babel/preset-react',
                                '@babel/preset-typescript',
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                exportLocalsConvention: 'camelCase',
                            },
                        },
                    },
                ],
            },
            {
                test: /\.less$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true
                            }
                        }
                    }
                ]
            }
            
        ],
    },
    target: 'web',
    devtool: 'source-map',
    resolve: {
        plugins: [new TsconfigPathsPlugin({
            configFile: path.join(__dirname, '../tsconfig.json')
        })],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
        modules: [path.join(__dirname, '.src'), 'node_modules'],
    },
    mode: 'development',
    plugins: [
        new webpack.EnvironmentPlugin({
            ENV: 'prod',
            NODE_ENV: 'development',
        }),
        new webpack.LoaderOptionsPlugin({
            debug: true,
        }),
        new HtmlWebpackPlugin({
            filename: '[name].html',
            template: path.resolve(__dirname, 'src', 'index.html'),
            inject: 'body',
            minify: false,
        }),
    ],
    devServer: {
        port: 9001,
        compress: true,
        liveReload: true,
        hot: true,
        https: true,
        open: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: {
            verbose: true,
            disableDotRule: false,
        },
    },
};
