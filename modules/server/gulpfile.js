const { parallel, series, watch, src, dest } = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const webpackStream = require('webpack-stream');
const webpack = require('webpack');

const webpackDevConfig = require('./webpack.development.config.js')

async function copy_files() {
    return src('./client/src/*.html')
    .pipe(dest('./client/build/', { overwrite: true }))
}

async function build_dev() {
    return src('./client/src/index.js')
    .pipe(webpackStream(webpackDevConfig), webpack)
    .pipe(dest('./client/build/', { overwrite: true }))
}

async function watch_server() {
    nodemon({
        verbose: false,
        script: './server.js',
        watch: ["server.js", "config.js", "models/*.*"]
    });
};

async function sync_browser() {
    browserSync.init({
        port: 3000,
        proxy: 'http://localhost:3030/',
        reloadDelay: 200
    });
    watch(['client/build/*.*']).on("change", () => {
        browserSync.reload()
    })
};

async function watch_client() {
    watch(['client/src/*.*']).on('change', series(copy_files, build_dev))
}

exports.build = series(copy_files, build_dev);
exports.watch = parallel(watch_server, watch_client, sync_browser);
