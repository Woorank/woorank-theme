# Woorank Living Style Guide

Styleguide pages built with [Kss Node](https://github.com/kss-node/kss-node).

## Development instructions

The style guide build tasks are made with [Gulp](https://github.com/gulpjs/gulp).

### Start the local environment

```bash
$ docker-compose build
$ docker-compose run --rm styleguide npm run build
$ docker-compose run --rm --service-ports styleguide
```

### Watcher

You can launch the development watch with the following command:

```bash
$ docker-compose run --rm styleguide npm run dev
```

### Development flow

You should develop your changes in the branches and create a pull request where the last commit is
setting the new version number according to the [semantic versioning](http://semver.org/).

Always use the `npm version` command to update the package:

```bash
$ npm version <major|minor|patch>
```

## Publication of the styleguide

To publish the styleguide changes you have to build the project at [CircleCI](https://circleci.com/gh/Woorank/woorank-theme).

Successfull build will automatically push the woorank-theme assets into the S3 with the current version number and can be used
in the applications.
