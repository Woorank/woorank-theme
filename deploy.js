#!/usr/bin/env node

var exec = require('child_process').exec;
var testVersion = require('./testIfVersionExists');

var pkg = require('./package');
var deployingVersion = pkg.version;

var deployCmd = 'aws s3 sync --acl public-read ./styleguide/build s3://' + process.env.BUCKET_NAME;

testVersion(deployingVersion, function (alreadyExists) {
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
