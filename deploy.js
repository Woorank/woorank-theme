#!/usr/bin/env node

var exec = require('child_process').exec;
var testVersion = require('./testVersion');

var pkg = require('./package');
var deployingVersion = pkg.version;
var testPath = '/woorank-theme/' + deployingVersion + '/woorank-theme.min.css';

var deployCmd = 'aws s3 sync --acl public-read ./styleguide/build s3://' + process.env.BUCKET_NAME;

if (!process.env.BUCKET_NAME) {
  throw new Error('BUCKET_NAME is not set');
}

testVersion(process.env.CDN_HOST, testPath, function (alreadyExists) {
  if (!alreadyExists) {
    exec(deployCmd, function (error) {
      if (error) {
        console.error('Upload failed');
        console.error(error);
        process.exit(1);
      } else {
        console.log('Uploaded OK');
        process.exit(0);
      }
    });
  } else {
    console.log('Version already exists on S3, not uploading.');
    process.exit(0);
  }
});
