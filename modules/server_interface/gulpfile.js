/* eslint-disable */
const { parallel, series, watch, src, dest } = require('gulp')
const browserSync = require('browser-sync').create()
const webpackStream = require('webpack-stream')
const webpack = require('webpack')
var gutil = require('gulp-util')

const webpackDevConfig = require('./webpack.development.config.js')
const webpackDeployConfig = require('./webpack.deployment.config.js')

async function copy_files() {
    return src('./src/*.css')
    .pipe(dest('./build/', { overwrite: true }))
}

async function build_webpack() {
    return src('./src/js/index.js')
    .pipe(webpackStream(webpackDevConfig), webpack)
    .on('error', gutil.log)
    .pipe(dest('./build/', { overwrite: true }))
}

async function sync_browser() {
    browserSync.init({
        port: 3000,
        server: "./build/",
        reloadDelay: 0
    });
    watch(['./build/*.*']).on("change", () => {
        browserSync.reload()
    })
};

async function watch_src_folder() {
    watch(['./src/*.*','./src/**/*.*']).on('change', series(copy_files, build_webpack))
}

async function deploy() {
    return src('./src/js/index.js')
    .pipe(webpackStream(webpackDeployConfig), webpack)
    .on('error', gutil.log)
    .pipe(dest('./../server/www/', { overwrite: true }))
}

const build = series(copy_files, build_webpack)

Object.assign(exports, {
    build: build,
    watch: series(build, parallel(watch_src_folder, sync_browser)),
    deploy: deploy
})