const { merge } = require('webpack-merge');
const common = require('./rspack.config');

const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { ImageMinimizerPlugin } = require('@rsbuild/plugin-image-compress');

module.exports = merge(common, {
    mode: 'production',

    devtool: false,

    output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/vendor/[name].js',
    },

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),

            new CssMinimizerPlugin(),

            new ImageMinimizerPlugin({
                use: 'webp',
                test: /\.(jpe?g|png)$/i,
                quality: 75,
            }),
        ],
    },
});