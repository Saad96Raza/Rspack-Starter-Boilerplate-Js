const { merge } = require('webpack-merge');
const common = require('./rspack.config');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
        compress: true,
        hot: true, // ✅ enable HMR
        port: 2000,
    },

    optimization: {
        minimize: false, // ❌ no minification in dev
    },
});