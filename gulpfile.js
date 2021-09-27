'use strict';

const autoprefixer = require('gulp-autoprefixer');
const connect = require('gulp-connect');
const debug = require('gulp-debug');
const del = require('del');
const { exec } = require('child_process');
const { src, dest, series, parallel, watch } = require('gulp');
const stylelint = require('gulp-stylelint');
const svgStore = require('gulp-svgstore');
const header = require('gulp-header');
const path = require('path');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const s3 = require('gulp-s3');
const sass = require('gulp-sass')(require('sass'));
const cheerio = require('gulp-cheerio');
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

const watchTask = () => {
  watch(path.join(paths.sass.styleguide, '**', '*.*'), ['kss']);
  watch(path.join(paths.sass.kss, '**', '*.scss'), ['kss']);
  watch(path.join(paths.template, '**', '*.html'), ['kss']);
  watch(path.join(paths.svg, '**', '*.svg'), ['kss']);
  watch(path.join(paths.svg, '**', '*.svg'), ['svg:build']);
};

const connectTask = () => connect.server({ root: 'styleguide'});

const picturesTask = () => {
  return src(path.join(paths.img, '**/*.*'))
    .pipe(dest(paths.build.img));
};

const scriptsTask = () => {
  return src(path.join(paths.public, '*.js'))
    .pipe(dest(paths.build.js)
  );
}
const kssTask = (cb) => {
  series(
    kssStructures,
    sassTask,
    scriptsTask
  );
  return exec('npm run kss', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
    src('*').pipe(connect.reload());
  });
}

const kssStructures = () => src(paths.structures).pipe(dest(paths.build.structures));

const lintCssTask = () => {
  return src(path.join(paths.sass.styleguide, '**', '*.scss'))
    .pipe(stylelint({
      syntax: 'scss',
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }));
};

const sassBuild = () => {
  return src([
    path.join(paths.sass.styleguide, '*.scss')
  ])
    .pipe(debug())
    .pipe(sass({
      importer: moduleImporter({
        extensions: [ '.css', '.scss' ]
      }),
      imagePath: paths.build.img,
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(dest(path.join('./styleguide/build/', pkg.version)))
    .pipe(dest('./build/'));
};

const sassTask = () => {
  return src([
    path.join(paths.sass.kss, '*.scss'),
    path.join(paths.sass.styleguide, '*.scss')
  ])
    .pipe(debug())
    .pipe(sass({
      importer: moduleImporter({
        extensions: [ '.css', '.scss' ]
      }),
      imagePath: paths.build.img,
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer())
    .pipe(dest(paths.build.css));
};

const svgBuildTask = () => {
  return src(path.join(paths.svg, '**', '*.svg'))
    .pipe(svgmin({
      plugins: [{
        cleanupIDs: true,
        removeUselessStrokeAndFill: true,
        mergePaths: true,
        removeUnknownsAndDefaults: false,
        cleanupEnableBackground: true
      }]
    }))
    .pipe(dest(path.join(paths.build.svg)));
};

const svgSymbolsTask = () => {
  return src(path.join(paths.svg, '**', '*.svg'))
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
      .pipe(svgStore({ inlineSvg: true }))
      .pipe(cheerio({
        run: ($) => {
          $('svg')
            .attr('style', 'position: absolute')
            .attr('width', '0')
            .attr('height', '0');
        },
        parserOptions: { xmlMode: true }
        }))
      .pipe(rename({ basename: 'symbols' }))
      .pipe(dest(path.join('./styleguide/build/', pkg.version)))
      .pipe(dest(paths.build.svg))
      .pipe(dest('./build/'));
};

const s3StyleguideTask = function (callback) {
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

    src('./styleguide/**/*')
      .pipe(s3({
        key: AWS_ACCESS_KEY_ID,
        secret: AWS_SECRET_ACCESS_KEY,
        region: 'us-east-1',
        bucket: 'styleguide.woorank.com'
      }))
      .on('end', callback);
  });
};

const s3AssetsTask = (done) => {
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

    src(`./styleguide/build/${pkg.version}/**`)
      .pipe(s3(awsConfig, awsOptions))
      .on('end', function () { console.log('Calling cb') || callback(); });
  });
  done();
};

const deployTask = (done) => {
  return runSequence(
    cleanTask,
    parallel(
      defaultTask,
      buildTask
    ),
    s3StyleguideTask,
    s3AssetsTask,
    done
  );
};

const cleanTask = () => {
  return del.sync([
    'styleguide/*.*',
    'styleguide/assets',
    'styleguide/public',
    '!styleguide/build',
    'styleguide/build/*'
  ], { force: true });
};

const devTask = series(defaultTask, lintCssTask, parallel(connectTask, watchTask));

const buildTask = series(
  sassTask,
  sassBuild,
  svgBuildTask,
  svgSymbolsTask,
  kssTask
);

const defaultTask = series(
  picturesTask,
  buildTask,
  kssTask
);

exports.dev = devTask;
exports.deploy = deployTask;
exports.connect = connectTask;

exports.build = buildTask;

exports.default = defaultTask;
