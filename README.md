# Woorank Living Style Guide

Styleguide pages built with [Kss Node](https://github.com/kss-node/kss-node).

## Development instructions

+ Create a AWS config file on the root folder of the project.
+ Name it awsConfig.json based on this template.
+ Fill it with **sensible** data from AWS.

```json
{
  "key": "",
  "secret": "",
  "region": "",
  "bucket": ""
}
```

## Using Style Guide

The style guide build tasks are made with [Gulp](https://github.com/gulpjs/gulp).

### Local connection
```bash
$ docker-compose build
$ docker-compose up
```

### Local render
```bash
$ docker-compose run --rm styleguide gulp
```

### Local build
```bash
$ docker-compose run --rm styleguide gulp build
```

### online publication
```bash
$ docker-compose run --rm styleguide gulp publish
```
