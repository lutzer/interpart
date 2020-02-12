const { parallel, watch, src, dest } = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js')
const webpack = require('webpack');

async function build() {
    return src('./client/index.js')
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(dest('./www/', { overwrite: true }))
}

async function watch_server() {
    nodemon({
        verbose: false,
        ignore: ["db.json","settings.json","www/*","client/*"],
        script: './server.js',
    });
};

async function sync_browser() {
    browserSync.init({
        port: 3000,
        proxy: 'http://localhost:3030/',
        reloadDelay: 200
    });
    watch(['www/*.*']).on("change", () => {
        browserSync.reload()
    })
};

async function watch_client() {
    watch(['client/*.*']).on('change', build)
}

exports.build = build;
exports.watch = parallel(watch_server, watch_client, sync_browser);
