var gulp          = require('gulp');
var autoprefixer  = require('gulp-autoprefixer');
var browserify    = require('gulp-browserify');
var debug         = require('gulp-debug');
var uglify        = require('gulp-uglify');
var s3            = require('gulp-s3');
var sass          = require('gulp-sass');
var svgSprite     = require('gulp-svg-sprites');
var connect       = require('gulp-connect');
var exec          = require('child_process').exec;

var paths = {
  sass:          'src/sass',
  sassKss:       'src/woorank-template/sass-kss',
  css:           'src/css',
  svg:           'src/svg',
  js:            'src/js',
  build: {
    img:         'styleguide/assets/img',
    css:         'styleguide/assets/style',
    svg:         'styleguide/assets/svg',
    js:          'styleguide/assets/js',
    cssKss:      'src/woorank-template/public',
    imgKss:      'src/woorank-template/puclic/img'
  }
};

gulp.task('default',
  ['sprite', 'sass', 'browserify', 'kss', 'connect', 'watch']
);

gulp.task('watch', function () {
  gulp.watch(paths.sass + '/**/*.scss', ['sass', 'kss']);
  gulp.watch(paths.sass + '/**/*.hbs', ['kss']);
  gulp.watch('src/woorank-template/**/*.html', ['kss']);
  gulp.watch(paths.sassKss + '/**/*.scss', ['sass-kss', 'kss']);
  gulp.watch(paths.svg + '/**/*.svg', ['sprite', 'kss']);
  gulp.watch(paths.js + '/**/*.js', ['browserify', 'kss']);
});

gulp.task('connect', function () {
  connect.server({
    root: 'styleguide',
    livereload: true
  });
});

gulp.task('kss', ['sass', 'sass-kss', 'browserify'], function (cb) {
  exec('kss-node --config=kss-config.json', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
    gulp.src('*').pipe(connect.reload());
  });
});

gulp.task('sass', function () {
  return gulp.src(paths.sass + '/*.scss')
    .pipe(debug())
    .pipe(sass({
      imagePath: paths.build.img,
      style: 'expanded',
      includePaths: '/node_modules/bootstrap-sass/assets/stylesheets/'
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.build.css));
});

gulp.task('sass-kss', function () {
  return gulp.src(paths.sassKss + '/*.scss')
    .pipe(debug())
    .pipe(sass({
      imagePath: paths.build.imgKss,
      style: 'expanded'
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.build.cssKss));
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

gulp.task('browserify', function () {
  return gulp.src(paths.js + '/*.js')
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest(paths.build.js));
});

gulp.task('publish', ['kss'], function () {
  var awsConfig = require('./awsConfig');
  return gulp.src('./styleguide/**/*')
    .pipe(s3(awsConfig));
});
