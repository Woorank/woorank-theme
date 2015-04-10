#!/usr/bin/env node

var exec = require('child_process').exec;
var http = require('http');

var theVersionAlreadyExists = false;

// We get the package version
var pkg  = require('./package');
var deployingVersion = pkg.version;

// We define the deploy command on s3
var deployCmd = 'aws s3 sync --acl public-read ' +
                './styleguide/build ' +
                's3://assets.woorank.com/woorank-theme';

// We check if this version has already been uploaded on S3
http.get({
  host: 'd384x5zk471rz.cloudfront.net',
  path: '/woorank-theme/' + deployingVersion + '/woorank-theme.min.css'
}, function (response) {

  // Update our variable depending on the status code
  theVersionAlreadyExists = (response.statusCode === 200) ? true : false;

  // If the version doesn't exist , let's upload it
  if (!theVersionAlreadyExists) {
    exec(deployCmd, function (error, stdOut) {
      if (!error) {
        console.log('Uploaded OK');
        process.exit(0);
      } else {
        console.error('Uploaded NotOK');
      }
    });
  } else {
    console.error('Version already exists on S3!');
  }

  process.exit(1);
});
