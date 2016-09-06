#!/usr/bin/env node

// Deploy the styleguide built files to aws on circleCI process.

var exec = require('child_process').exec;
var http = require('http');

var theVersionAlreadyExists = false;

// We get the package version
var pkg = require('./package');
var deployingVersion = pkg.version;

// We define the deploy command on s3
var deployCmd = 'aws s3 sync --acl public-read ' +
  './styleguide/build ' + 's3://' + process.env.BUCKET_NAME;

// We check if this version has already been uploaded on S3
http.get({
  host: process.env.CDN_HOST,
  path: '/woorank-theme/' + deployingVersion + '/woorank-theme.min.css'
}, function (response) {
  // Update our variable depending on the status code
  theVersionAlreadyExists = (response.statusCode === 200);

  // If the version doesn't exist , let's upload it
  if (!theVersionAlreadyExists) {
    exec(deployCmd, function (error, stdOut) {
      if (!error) {
        console.log('Uploaded OK');
        process.exit(0);
      } else {
        console.error('Uploaded Failed');
        process.exit(1);
      }
    });
  } else {
    console.error('Version already exists on S3 - not uploading!');
    process.exit(0);
  }
});
