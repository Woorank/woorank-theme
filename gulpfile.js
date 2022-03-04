'use strict';

const autoprefixer = require('gulp-autoprefixer');
const connect = require('gulp-connect');
const debug = require('gulp-debug');
const del = require('del');
const exec = require('child_process').exec;
const gulp = require('gulp');
const gulpStylelint = require('gulp-stylelint');
const gulpSvgStore = require('gulp-svgstore');
const header = require('gulp-header');
const path = require('path');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const s3 = require('gulp-s3');
const sass = require('gulp-sass')(require('sass'));
const gulpCheerio = require('gulp-cheerio');
const svgmin = require('gulp-svgmin');
const moduleImporter = require('sass-module-importer');

const pkg = require('./package');
const testIfFileExistsInS3 = require('./existsInS3');

const paths = {
  sass: {
    styleguide: 'src/sass',
    kss: 'src/template/sass-kss'
  },
  css: 'src/css',
  svg: 'src/svg',
  img: 'src/img',
  template: 'src/template',
  structures: 'src/template/structures/*.html',
  public: 'src/template/public',
  build: {
    styleguide: 'styleguide',
    structures: 'styleguide/structures',
    assets: 'styleguide/assets/',
    img: 'styleguide/assets/img',
    css: 'styleguide/assets/styles',
    svg: 'styleguide/assets/svg',
    png: 'styleguide/assets/png',
    js: 'styleguide/assets/scripts'
  }
};

const banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

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

gulp.task('kss',
  [
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
  return gulp.src(path.join(paths.sass.styleguide, '**', '*.scss'))
    .pipe(gulpStylelint({
      syntax: 'scss',
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }));
});

gulp.task('sass', function () {
  return gulp.src([
    path.join(paths.sass.styleguide, '*.scss')
  ])
    .pipe(debug())
    .pipe(sass({
      importer: moduleImporter({
        extensions: ['.css', '.scss']
      }),
      imagePath: paths.build.img,
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest(path.join('./styleguide/build/', pkg.version)))
    .pipe(gulp.dest('./build/'));
});

gulp.task('sass:build', function () {
  return gulp.src([
    path.join(paths.sass.styleguide, '*.scss')
  ])
    .pipe(debug())
    .pipe(sass({
      importer: moduleImporter({
        extensions: ['.css', '.scss']
      }),
      imagePath: paths.build.img,
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest(path.join('./styleguide/build/', pkg.version)))
    .pipe(gulp.dest('./build/'));
});

gulp.task('sass-kss', function () {
  return gulp.src([
    path.join(paths.sass.kss, '*.scss'),
    path.join(paths.sass.styleguide, '*.scss')
  ])
    .pipe(debug())
    .pipe(sass({
      importer: moduleImporter({
        extensions: ['.css', '.scss']
      }),
      imagePath: paths.build.img,
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
gulp.task('svg:dump', function () {
  let svgSrcPaths = [
    '/01-basic',
    '/02-arrows',
    '/03-navigation',
    '/04-network',
    '/05-social',
    '/06-technology',
    '/07-application',
    '/08-bullets',
    '/09-logo',
    '/10-contextuals',
    '/11-third-party'
  ];
  svgSrcPaths.map(function (file) {
    return gulp.src(path.join(paths.svg + file, '**', '*.svg'))
      .pipe(svgmin({
        plugins: [{
          cleanupIDs: true,
          removeUselessStrokeAndFill: true,
          mergePaths: true,
          removeUnknownsAndDefaults: false,
          cleanupEnableBackground: true
        }]
      }))
      .pipe(gulp.dest('./build/icons'));
  })
});

gulp.task('svgstore', function () {
  return gulp
    .src(path.join(paths.svg, '**', '*.svg'))
    .pipe(svgmin({
      plugins: [{
        removeViewBox: false,
        cleanupIDs: false,
        removeUselessStrokeAndFill: true,
        mergePaths: true,
        removeUnknownsAndDefaults: false,
        cleanupEnableBackground: true,
        removeStyleElement: true
      }]
    }))
    .pipe(gulpSvgStore({ inlineSvg: true }))
    .pipe(gulpCheerio({
      run: ($) => {
        $('svg')
          .attr('style', 'position: absolute')
          .attr('width', '0')
          .attr('height', '0');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(rename({ basename: 'symbols' }))
    .pipe(gulp.dest(path.join('./styleguide/build/', pkg.version)))
    .pipe(gulp.dest(paths.build.svg))
    .pipe(gulp.dest('./build/'));
});

gulp.task('s3-styleguide', function (callback) {
  const testHost = 'styleguide.woorank.com';
  const testPath = `/build/${pkg.version}/woorank-theme.min.css`;

  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    console.error('No AWS access/secret key set, not trying to upload.');
    return callback();
  }

  testIfFileExistsInS3(testHost, testPath).then(styleExistsInS3 => {
    if (styleExistsInS3) {
      console.warn(`s3://${testHost}${testPath} already exists in S3, returning gracefully...`);
      return callback();
    }

    gulp.src('./styleguide/**/*')
      .pipe(s3({
        key: AWS_ACCESS_KEY_ID,
        secret: AWS_SECRET_ACCESS_KEY,
        region: 'us-east-1',
        bucket: 'styleguide.woorank.com'
      }))
      .on('end', callback);
  });
});

gulp.task('s3-assets', function (callback) {
  const testHost = process.env.CDN_URL || 'dz17jvmxa7kn9.cloudfront.net';
  const testPath = `/woorank-theme/${pkg.version}/woorank-theme.min.css`;
  const testOptions = {
    https: true
  };

  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    console.error('No AWS access/secret key set, not trying to upload.');
    return callback();
  }

  const awsConfig = {
    'key': AWS_ACCESS_KEY_ID,
    'secret': AWS_SECRET_ACCESS_KEY,
    'region': 'us-east-1',
    'bucket': 'assets.woorank.com'
  };

  const awsOptions = {
    headers: {
      'Cache-Control': 'max-age=315360000'
    },
    uploadPath: `woorank-theme/${pkg.version}/`
  };

  testIfFileExistsInS3(testHost, testPath, testOptions).then(styleExistsInS3 => {
    if (styleExistsInS3) {
      console.warn(`s3://${testHost}${testPath} already exists in S3, returning gracefully...`);
      return callback();
    }

    gulp.src(`./styleguide/build/${pkg.version}/**`)
      .pipe(s3(awsConfig, awsOptions))
      .on('end', function () { console.log('Calling cb') || callback(); });
  });
});

gulp.task('deploy', function (callback) {
  return runSequence('clean', ['default', 'build'], 's3-styleguide', 's3-assets', callback);
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
  'sass',
  'sass:build',
  'svg:build',
  'svg:dump',
  'svgstore',
  'kss'
]);
