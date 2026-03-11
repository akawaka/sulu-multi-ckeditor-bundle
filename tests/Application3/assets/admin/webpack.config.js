/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable import/no-nodejs-modules*/
/* eslint-disable no-undef */
const path = require('path');
const webpackConfig = require('../../vendor/sulu/sulu/webpack.config.js');

module.exports = (env, argv) => {
    env = env ? env : {};
    argv = argv ? argv : {};

    env.project_root_path = path.resolve(__dirname, '..', '..');
    env.node_modules_path = path.resolve(__dirname, 'node_modules');

    const config = webpackConfig(env, argv);
    config.entry = path.resolve(__dirname, 'index.js');

    // Ensure modules from our bundle's assets/ can resolve dependencies
    // from this application's node_modules (needed for imports from ../../../../assets/admin/)
    if (!config.resolve) {
        config.resolve = {};
    }
    if (!config.resolve.modules) {
        config.resolve.modules = [];
    }
    config.resolve.modules.push(path.resolve(__dirname, 'node_modules'));
    config.resolve.modules.push('node_modules');

    return config;
};
