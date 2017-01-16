'use strict';

require('es6-promise').polyfill();

var babel = require('gulp-babel');
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
var gulpSvgSprite = require('gulp-svg-sprite');
var svg2png = require('gulp-svg2png');
var gulpStylelint = require('gulp-stylelint');
var pkg = require('./package');

var paths = {
  sass: {
    styleguide: 'src/sass',
    kss: 'src/template/sass-kss',
    wooComponents: 'woo-components/src/sass'
  },
  js: {
    wooComponents: 'woo-components/src'
  },
  css: 'src/css',
  svg: 'src/svg',
  img: 'src/img',
  template: 'src/template',
  structures: 'src/template/structures/*.html',
  public: 'src/template/public',
  bootstrap: '/node_modules/bootstrap-sass/assets/stylesheets/',
  build: {
    styleguide: 'styleguide',
    structures: 'styleguide/structures',
    assets: 'styleguide/assets/',
    img: 'styleguide/assets/img',
    css: 'styleguide/assets/styles',
    svg: 'styleguide/assets/svg',
    png: 'styleguide/assets/png',
    js: 'styleguide/assets/scripts',
    wooComponents: 'woo-components/dist'
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
  'pictures',
  'build',
  'kss'
]);

gulp.task('dev', [
  'connect',
  'default',
  'watch',
  'lint-css'
]);

gulp.task('build', [
  'scripts:woo-components',
  'sass',
  'sass:build',
  'svg2png',
  'svg:build',
  'kss'
]);

gulp.task('watch', function () {
  gulp.watch(path.join(paths.sass.styleguide, '**', '*.*'), ['kss']);
  gulp.watch(path.join(paths.sass.kss, '**', '*.scss'), ['kss']);
  gulp.watch(path.join(paths.template, '**', '*.html'), ['kss']);
  gulp.watch(path.join(paths.svg, '**', '*.svg'), ['kss']);
  gulp.watch(path.join(paths.svg, '**', '*.svg'), ['svg:build']);
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

gulp.task('scripts:woo-components', function () {
  return gulp.src([
    path.join(paths.js.wooComponents, '**/index.js'),
    path.join(paths.js.wooComponents, '**/*.jsx')
  ])
    .pipe(babel({
      presets: ['es2015', 'react']
    }))
    .pipe(gulp.dest(paths.build.wooComponents));
});

gulp.task('kss',
  [
    'svg-sprite:build',
    'kss:structures',
    'sass',
    'sass-kss',
    'scripts'
  ], function (cb) {
    return exec('npm run kss',
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

gulp.task('lint-css', function () {
  return gulp.src(path.join(paths.build.css, '**', '*.css'))
    .pipe(gulpStylelint({
      reporters: [{
        formatter: 'verbose',
        console: true
      }]
    }));
});

gulp.task('sass', function () {
  return gulp.src([
    path.join(paths.sass.styleguide, '*.scss'),
    path.join(paths.sass.wooComponents, '*.scss')
  ])
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
  return gulp.src([
    path.join(paths.sass.styleguide, '*.scss'),
    path.join(paths.sass.wooComponents, '*.scss')
  ])
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
    path.join(paths.sass.kss, '*.scss'),
    path.join(paths.sass.styleguide, '*.scss')
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

gulp.task('svg:build', function () {
  return gulp.src(path.join(paths.svg, '**', '*.svg'))
    .pipe(svgmin({
      plugins: [{
        cleanupIDs: true,
        removeUselessStrokeAndFill: true,
        mergePaths: true,
        removeUnknownsAndDefaults: false,
        cleanupEnableBackground: true
      }]
    }))
    .pipe(gulp.dest(path.join(paths.build.svg)));
});

gulp.task('svg-sprite:build', function () {
  return gulp.src(path.join(paths.svg, '**', '*.svg'))
  .pipe(gulpSvgSprite({
    mode: {
      symbol: {
        dest: '.',
        sprite: 'symbols.svg'
      }
    },
    shape: {
      id: {
        generator: function (name) {
          return name.replace(/.svg/g, '').replace(/^.+?[/]/g, '');
        }
      },
      dest: 'icons'
    },
    transform: [
      {svgo: {
        plugins: [
          { removeViewBox: false },
          { removeUselessStrokeAndFill: true },
          { cleanupIDs: false },
          { mergePaths: true },
          { removeUnknownsAndDefaults: false },
          { cleanupEnableBackground: true },
          { removeStyleElement: true }
        ]
      }}
    ],
    svg: {
      xmlDeclaration: false,
      doctypeDeclaration: false,
      rootAttributes: {
        width: 0,
        height: 0,
        style: 'position:absolute'
      }
    }
  }))
  .pipe(gulp.dest(path.join('./styleguide/build/', pkg.version)))
  .pipe(gulp.dest(paths.build.svg));
});

gulp.task('svg2png', function () {
  gulp.src(path.join(paths.svg, '**', '*.svg'))
  .pipe(svg2png())
  .pipe(gulp.dest(paths.build.png));
});

gulp.task('s3', function (callback) {
  var testVersion = require('./testVersion');
  var version = require('./package').version;

  var host = 'styleguide.woorank.com';
  var testPath = `/build/${version}/woorank-theme.min.css`;

  testVersion(host, testPath, function (exists) {
    var awsConfig = require('./awsConfig');

    if (exists) {
      console.log('The version already exists in S3, returning gracefully...');
      return callback();
    }

    gulp.src('./styleguide/**/*')
    .pipe(s3(awsConfig))
    .on('end', callback);
  });
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
