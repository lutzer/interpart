const { parallel, series, watch, src, dest } = require('gulp');
const browserSync = require('browser-sync').create();
const webpackStream = require('webpack-stream');
const webpack = require('webpack');

const webpackDevConfig = require('./webpack.development.config.js')

async function copy_files() {
    return src('./src/*.html')
    .pipe(dest('./build/', { overwrite: true }))
}

async function build_webpack() {
    return src('./src/index.js')
    .pipe(webpackStream(webpackDevConfig), webpack)
    .pipe(dest('./build/', { overwrite: true }))
}

async function sync_browser() {
    browserSync.init({
        port: 3000,
        server: "./build/",
        reloadDelay: 100
    });
    watch(['./build/*.*']).on("change", () => {
        browserSync.reload()
    })
};

async function watch_src_folder() {
    watch(['./src/*.*']).on('change', series(copy_files, build_webpack))
}

const build = series(copy_files, build_webpack)

exports.build = build;
exports.watch = series(build, parallel(watch_src_folder, sync_browser));