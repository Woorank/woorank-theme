var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    s3 = require("gulp-s3"),
    debug = require('gulp-debug'),
    svgSprite = require('gulp-svg-sprites'),
    styleguide = require('sc5-styleguide');


var sassOptions = {
  includePaths: __dirname + '/node_modules/bootstrap-sass/assets/stylesheets/'
};

var styleguideOptions = {
  title: 'WooRank Styleguide',
  overviewPath: './overview.md',
  styleVariables: './lib/_variables.scss',
  commonClass: 'woo-theme',
  extraHead: [
    '<script src="//code.jquery.com/jquery-2.1.1.min.js"></script>',
    '<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>'
  ],
  sass: sassOptions
};


gulp.task('sprite', ['build-styleguide'], function () {
  return gulp.src(require('./lib/icons/include'))
    .pipe(svgSprite({mode: "symbols"}))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./styleguide/woorank'));
});

gulp.task('build', ['build-styleguide'], function () {
  return gulp.src('./lib/woorank-theme.scss')
    .pipe(sass(sassOptions))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./styleguide/woorank'));
});

gulp.task('build-styleguide', function() {
  return gulp.src('./lib/**/*.scss')
    .pipe(styleguide(styleguideOptions))
    .pipe(gulp.dest('./styleguide'));
});

gulp.task('develop', ['sprite', 'build'], function() {
  gulp.watch('./lib/**/*.scss', ['sprite', 'build']);
  styleguideOptions.server = true;
  styleguideOptions.rootPath = './styleguide/';
  return gulp.src('./lib/**/*.scss')
    .pipe(styleguide(styleguideOptions))
    .pipe(gulp.dest(styleguideOptions.rootPath));
});

gulp.task('publish-styleguide', [ 'build-styleguide' ], function() {
  var awsConfig = require('./awsConfig');
  return gulp.src('./styleguide/**/*')
    .pipe(s3(awsConfig));
});

gulp.task('watch-styleguide', [ 'build-styleguide' ], function () {
  return gulp.watch('./lib/**/*.scss', [ 'build-styleguide' ]);
});


gulp.task('default', ['build']);
