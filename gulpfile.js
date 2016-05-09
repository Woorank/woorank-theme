'use strict';

require('es6-promise').polyfill();

var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');
var debug = require('gulp-debug');
var del = require('del');
var exec = require('child_process').exec;
var gulp = require('gulp');
var header = require('gulp-header');
var path = require('path');
var rename = require('gulp-rename');
var runSequence = require('gulp-run-sequence');
var s3 = require('gulp-s3');
var sass = require('gulp-sass');
var svgmin = require('gulp-svgmin');
var svgSprite = require('gulp-svg-sprites');

var pkg = require('./package');

var paths = {
  sass: 'src/sass',
  css: 'src/css',
  svg: 'src/svg',
  img: 'src/img',
  template: 'src/template',
  structures: 'src/template/structures/*.html',
  sassKss: 'src/template/sass-kss',
  public: 'src/template/public',
  bootstrap: '/node_modules/bootstrap-sass/assets/stylesheets/',
  build: {
    styleguide: 'styleguide',
    structures: 'styleguide/structures',
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
  'svg',
  'sprite',
  'pictures',
  'build',
  'kss'
]);

gulp.task('dev', [
  'connect',
  'default',
  'watch'
]);

gulp.task('build', ['sass', 'sass:build', 'svg:build', 'sprite:build']);

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

gulp.task('kss', ['kss:structures', 'sprite', 'sass', 'sass-kss', 'scripts'], function (cb) {
  return exec('kss-node --config=kss-config.json',
    function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
      gulp.src('*').pipe(connect.reload());
    });
});

gulp.task('kss:structures', function () {
  return gulp.src(paths.structures)
    .pipe(gulp.dest(paths.build.structures));
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

gulp.task('sass:build', function () {
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

gulp.task('svg', function () {
  return gulp.src(path.join(paths.svg, '**', '*.svg'))
    .pipe(gulp.dest(paths.build.svg));
});

gulp.task('svg:build', function () {
  return gulp.src(path.join(paths.svg, '**', '*.svg'))
    .pipe(svgmin({
      plugins: [{
        cleanupIDs: true
      }]
    }))
    .pipe(gulp.dest(path.join('./styleguide/build/', pkg.version)));
});

gulp.task('sprite:build', function () {
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

gulp.task('s3', function () {
  var awsConfig = require('./awsConfig');
  return gulp.src('./styleguide/**/*')
    .pipe(s3(awsConfig));
});

gulp.task('publish', function (callback) {
  return runSequence('clean', ['default', 'build'], 's3', callback);
});

gulp.task('clean', function () {
  return del.sync(
    [
      'styleguide/*.*',
      'styleguide/assets',
      'styleguide/public',
      '!styleguide/build',
      'styleguide/build/*'
    ],
    { force: true }
  );
});
