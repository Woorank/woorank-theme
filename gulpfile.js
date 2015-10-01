var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');
var debug = require('gulp-debug');
var exec = require('child_process').exec;
var gulp = require('gulp');
var path = require('path');
var pjson = require('./package.json');
var s3 = require('gulp-s3');
var sass = require('gulp-sass');
var svgSprite = require('gulp-svg-sprites');
var rename = require('gulp-rename');

var paths = {
  sass: 'src/sass',
  sassKss: 'src/woorank-template/sass-kss',
  css: 'src/css',
  svg: 'src/svg',
  img: 'src/img',
  build: {
    img: 'styleguide/assets/img',
    css: 'styleguide/assets/style',
    svg: 'styleguide/assets/svg',
    js: 'styleguide/assets/script',
    cssKss: 'src/woorank-template/public',
    imgKss: 'src/woorank-template/puclic/img'
  }
};

gulp.task('default', [
  'move-pictures',
  'sprite',
  'sass',
  'kss',
  'connect'
]);

gulp.task('dev', [
  'move-pictures',
  'sprite',
  'sass',
  'kss'
]);

gulp.task('docker', ['connect']);

gulp.task('build', ['sass-build']);

gulp.task('watch', function () {
  gulp.watch(path.join(paths.sass, '**', '*.scss'), ['sass', 'kss']);
  gulp.watch(path.join(paths.sass, '**', '*.hbs'), ['kss']);
  gulp.watch('src/woorank-template/**/*.html', ['kss']);
  gulp.watch(path.join(paths.sassKss, '**', '*.scss'), ['sass-kss', 'kss']);
  gulp.watch(path.join(paths.svg, '**', '*.svg'), ['sprite', 'kss']);
});

gulp.task('connect', function () {
  return connect.server({
    root: 'styleguide'
  });
});

gulp.task('move-pictures', function () {
  return gulp.src(path.join(paths.img, '**/*.*'))
    .pipe(gulp.dest(paths.build.img));
});

gulp.task('kss', ['sprite', 'sass', 'sass-kss'], function (cb) {
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
      outputStyle: 'expanded',
      includePaths: '/node_modules/bootstrap-sass/assets/stylesheets/'
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.build.css))
    .pipe(gulp.dest(path.join('./styleguide/build/', pjson.version)));
});

gulp.task('sass-build', function () {
  return gulp.src(path.join(paths.sass, '*.scss'))
    .pipe(debug())
    .pipe(sass({
      imagePath: paths.build.img,
      outputStyle: 'compressed',
      includePaths: '/node_modules/bootstrap-sass/assets/stylesheets/'
    }))
    .pipe(autoprefixer())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(path.join('./styleguide/build/', pjson.version)));
});

gulp.task('sass-kss', function () {
  return gulp.src(path.join(paths.sassKss, '/*.scss'))
    .pipe(debug())
    .pipe(sass({
      imagePath: paths.build.imgKss,
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.build.cssKss));
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

gulp.task('publish', ['build', 'kss'], function () {
  var awsConfig = require('./awsConfig');
  return gulp.src('./styleguide/**/*')
    .pipe(s3(awsConfig));
});
