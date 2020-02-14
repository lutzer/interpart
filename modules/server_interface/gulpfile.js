/* eslint-disable */
const { parallel, series, watch, src, dest } = require('gulp')
const browserSync = require('browser-sync').create()
const webpackStream = require('webpack-stream')
const webpack = require('webpack')
var gutil = require('gulp-util')

const webpackDevConfig = require('./webpack.development.config.js')
const webpackDeployConfig = require('./webpack.deployment.config.js')

const devBuildFolder = './build'
const deployBuildFolder = './../server/www/'

async function copy_files_dev() {
    return src('./src/*.css')
    .pipe(dest(devBuildFolder, { overwrite: true }))
}

async function copy_files_deploy() {
    return src('./src/*.css')
    .pipe(dest(deployBuildFolder, { overwrite: true }))
}

async function build_webpack_dev() {
    return src('./src/js/index.js')
    .pipe(webpackStream(webpackDevConfig), webpack)
    .on('error', gutil.log)
    .pipe(dest(devBuildFolder, { overwrite: true }))
}

async function build_webpack_deploy() {
    return src('./src/js/index.js')
    .pipe(webpackStream(webpackDeployConfig), webpack)
    .on('error', gutil.log)
    .pipe(dest(deployBuildFolder, { overwrite: true }))
}

const build_dev = series(copy_files_dev, build_webpack_dev)

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
    watch(['./src/*.*','./src/**/*.*']).on('change', build_dev)
}


Object.assign(exports, {
    build: build_dev,
    watch: series(build_dev, parallel(watch_src_folder, sync_browser)),
    deploy: series(copy_files_deploy, build_webpack_deploy)
})