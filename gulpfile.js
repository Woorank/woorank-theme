var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    s3 = require("gulp-s3"),
    debug = require('gulp-debug'),
    styleguide = require('sc5-styleguide');


var sassOptions = {
  includePaths: __dirname + '/node_modules/bootstrap-sass/assets/stylesheets/'
};

var styleguideOptions = {
  title: 'My Styleguide',
  overviewPath: './overview.md',
  styleVariables: './lib/_variables.scss',
  extraHead: [],
  sass: sassOptions
};

gulp.task('build', function () {
  return gulp.src('./lib/woorank-theme.scss')
    .pipe(sass(sassOptions))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist'));
});

gulp.task('develop', function() {
  styleguideOptions.server = true;
  styleguideOptions.rootPath = './styleguide/';
  return gulp.src('./lib/**/*.scss')
    .pipe(styleguide(styleguideOptions))
    .pipe(gulp.dest(styleguideOptions.rootPath));
});

gulp.task('build-styleguide', function() {
  return gulp.src('./lib/**/*.scss')
    .pipe(styleguide(styleguideOptions))
    .pipe(gulp.dest('./styleguide'));
});


gulp.task('publish-styleguide', [ 'build-styleguide' ], function() {
  var awsConfig = require('./awsConfig');
  return gulp.src('./styleguide/**/*')
    .pipe(s3(awsConfig));
});

gulp.task('watch-styleguide', ['build-styleguide'], function () {
  return gulp.watch('./lib/**/*.scss', ['build-styleguide']);
});

gulp.task('default', ['build']);
