const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rspack = require('@rspack/core');

const pugPages = glob.sync('src/views/pages/*.pug');

module.exports = {
    entry: path.resolve(__dirname, "src/apps/index.js"),

    output: {
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: 'js/vendor/[name].js',
        filename: 'js/[name].bundle.js',
        clean: true,
    },

    module: {
        rules: [
            {
                test: /\.(glb|gltf)$/,
                type: 'asset/resource',
            },
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: 'builtin:swc-loader'
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                type: 'asset/source'
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    rspack.CssExtractRspackPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                        {
                        loader: "sass-loader",
                        options: {
                                api: "modern-compiler",
                                sassOptions: {
                                loadPaths: [path.resolve(__dirname, "src/scss")],
                                includePaths: [path.resolve(__dirname, "src/scss")],
                            },
                        },
                    }
                ],
            },
            {
                test: /\.pug$/,
                loader: '@webdiscus/pug-loader',
                options: {
                    mode: 'render' 
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
                exclude: /src\/styles/,
                type: 'asset/resource',
                generator: {
                    filename: 'media/[name][ext]',
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[name][ext]"
                }
            }
        ]
    },

    plugins: [
        new rspack.CssExtractRspackPlugin({
            filename: "css/[name].css",
        }),

        new rspack.CopyRspackPlugin({
            patterns: [
                { from: 'src/media', to: 'media' },
            ],
        }),

        ...pugPages.map((file) => {
            const pageName = path.basename(file, '.pug');
            return new HtmlWebpackPlugin({
                title: pageName.charAt(0).toUpperCase() + pageName.slice(1),
                template: file,
                filename: (pageName === 'home') ? 'index.html' : pageName + '.html',
                inject: 'body',
                chunks: 'all'
            });
        }),
    ],
};