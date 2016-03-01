'use strict';

var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');
var debug = require('gulp-debug');
var del = require('del');
var exec = require('child_process').exec;
var gulp = require('gulp');
var header = require('gulp-header');
var path = require('path');
var rename = require('gulp-rename');
var s3 = require('gulp-s3');
var sass = require('gulp-sass');
var svgSprite = require('gulp-svg-sprites');
var svgmin = require('gulp-svgmin');

var pkg = require('./package');

var paths = {
  sass: 'src/sass',
  css: 'src/css',
  svg: 'src/svg',
  img: 'src/img',
  template: 'src/template',
  sassKss: 'src/template/sass-kss',
  public: 'src/template/public',
  bootstrap: '/node_modules/bootstrap-sass/assets/stylesheets/',
  build: {
    assets: 'styleguide/assets/',
    img: 'styleguide/assets/img',
    css: 'styleguide/assets/styles',
    svg: 'styleguide/assets/svg',
    js: 'styleguide/assets/scripts'
  }
};

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('default', [
  'connect',
  'sprite',
  'pictures',
  'build',
  'kss'
]);

gulp.task('dev', [
  'default',
  'watch'
]);

gulp.task('build', ['sass', 'sass-build', 'sprite-build']);

gulp.task('watch', function () {
  gulp.watch(path.join(paths.sass, '**', '*.*'), ['kss']);
  gulp.watch(path.join(paths.sassKss, '**', '*.scss'), ['kss']);
  gulp.watch(path.join(paths.template, '**', '*.html'), ['kss']);
  gulp.watch(path.join(paths.svg, '**', '*.svg'), ['kss']);
});

gulp.task('connect', function () {
  return connect.server({
    root: 'styleguide'
  });
});

gulp.task('pictures', function () {
  return gulp.src(path.join(paths.img, '**/*.*'))
    .pipe(gulp.dest(paths.build.img));
});

gulp.task('scripts', function () {
  return gulp.src(path.join(paths.public, '*.js'))
    .pipe(gulp.dest(paths.build.js));
});

gulp.task('kss', ['sprite', 'sass', 'sass-kss', 'scripts'], function (cb) {
  return exec('kss-node --config=kss-config.json',
    function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
      gulp.src('*').pipe(connect.reload());
    });
});

gulp.task('sass', function () {
  return gulp.src(path.join(paths.sass, '*.scss'))
    .pipe(debug())
    .pipe(sass({
      imagePath: paths.build.img,
      includePaths: paths.bootstrap,
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest(path.join('./styleguide/build/', pkg.version)));
});

gulp.task('sass-build', function () {
  return gulp.src(path.join(paths.sass, '*.scss'))
    .pipe(debug())
    .pipe(sass({
      imagePath: paths.build.img,
      includePaths: paths.bootstrap,
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest(path.join('./styleguide/build/', pkg.version)));
});

gulp.task('sass-kss', function () {
  return gulp.src([
    path.join(paths.sassKss, '*.scss'),
    path.join(paths.sass, '*.scss')
  ])
    .pipe(debug())
    .pipe(sass({
      imagePath: paths.build.img,
      includePaths: paths.bootstrap,
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.build.css));
});

gulp.task('sprite', function () {
  return gulp.src(path.join(paths.svg, '**', '*.svg'))
    .pipe(svgSprite({
      mode: 'symbols',
      preview: false,
      svg: {
        symbols: 'symbols.svg'
      }
    }))
    .pipe(gulp.dest(paths.build.svg));
});

gulp.task('sprite-build', function () {
  return gulp.src(path.join(paths.svg, '**', '*.svg'))
    .pipe(svgSprite({
      mode: 'symbols',
      preview: false,
      svg: {
        symbols: 'symbols.svg'
      }
    }))
    .pipe(svgmin({
      plugins: [{
        cleanupIDs: false
      }]
    }))
    .pipe(gulp.dest(path.join('./styleguide/build/', pkg.version)));
});

gulp.task('publish', function () {
  var awsConfig = require('./awsConfig');
  return gulp.src('./styleguide/**/*')
    .pipe(s3(awsConfig));
});

gulp.task('clean', function () {
  return del.sync(
    [
      'styleguide/*.*',
      'styleguide/assets',
      'styleguide/public',
      '!styleguide/build'
    ],
    { force: true }
  );
});
