'use strict';

const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const connect = require('gulp-connect');
const debug = require('gulp-debug');
const del = require('del');
const exec = require('child_process').exec;
const gulp = require('gulp');
const gulpStylelint = require('gulp-stylelint');
const gulpSvgSprite = require('gulp-svg-sprite');
const header = require('gulp-header');
const path = require('path');
const rename = require('gulp-rename');
const runSequence = require('gulp-run-sequence');
const s3 = require('gulp-s3');
const sass = require('gulp-sass');
const svg2png = require('gulp-svg2png');
const svgmin = require('gulp-svgmin');

const pkg = require('./package');
const testIfFileExistsInS3 = require('./existsInS3');

const paths = {
  sass: {
    styleguide: 'src/sass',
    kss: 'src/template/sass-kss',
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
    path.join(paths.sass.styleguide, '*.scss')
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
    path.join(paths.sass.styleguide, '*.scss')
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
  const scale = 1;
  const verbose = true;
  const concurrency = undefined;

  return gulp.src(path.join(paths.svg, '**', '*.svg'))
  .pipe(svg2png(scale, verbose, concurrency))
  .pipe(gulp.dest(paths.build.png));
});

gulp.task('s3-styleguide', function (callback) {
  const testHost = 'styleguide.woorank.com';
  const testPath = `/build/${pkg.version}/woorank-theme.min.css`;

  testIfFileExistsInS3(testHost, testPath).then(styleExistsInS3 => {
    if (styleExistsInS3) {
      console.warn(`s3://${testHost}${testPath} already exists in S3, returning gracefully...`);
      return callback();
    }

    // awsConfig for the styleguide is generated on the circleci before publish
    const awsConfig = require('./awsConfig');

    gulp.src('./styleguide/**/*')
      .pipe(s3(awsConfig))
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

gulp.task('publish', function (callback) {
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
  'scripts:woo-components',
  'sass',
  'sass:build',
  'svg2png',
  'svg:build',
  'kss'
]);
