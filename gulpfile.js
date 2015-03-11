var gulp          = require('gulp');
var autoprefixer  = require('gulp-autoprefixer');
var debug         = require('gulp-debug');
var s3            = require('gulp-s3');
var sass          = require('gulp-sass');
var svgSprite     = require('gulp-svg-sprites');

var paths = {
  sass:          'src/sass',
  less:          'src/less',
  css:           'src/css',
  svg:           'src/svg',
  js:            'src/js',
  build: {
    css:         'assets/style',
    js:          'assets/script',
    svg:         'assets/svg',
    img:         'assets/img'
  }
};

gulp.task('default',
  [
    'sprite',
    'sass',
    'less'
  ]
);

gulp.task('watch', function () {
  gulp.watch(paths.sass + '/**/*.scss', ['sass']);
  gulp.watch(paths.svg + '/**/*.svg', ['sprite']);
});

gulp.task('sass', function () {
  return gulp.src(paths.sass + '/*.scss')
    .pipe(sass({
      imagePath: paths.build.img,
      style: 'expanded',
      includePaths: '/node_modules/bootstrap-sass/assets/stylesheets/'
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.build.css));
});

gulp.task('sprite', function () {
  return gulp.src(paths.svg + '/*.svg')
    .pipe(svgSprite({
      mode: 'symbols',
      preview: false,
      svg: {
        symbols: 'symbols.svg'
      }
    }))
    .pipe(gulp.dest(paths.build.svg));
});

gulp.task('publish', ['styleguide'], function () {
  var awsConfig = require('./awsConfig');
  return gulp.src('./styleguide/**/*')
    .pipe(s3(awsConfig));
});
