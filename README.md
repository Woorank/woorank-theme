# Woorank Living Style Guide

Styleguide pages built with [Kss Node](https://github.com/kss-node/kss-node).

## Development instructions

The style guide build tasks are made with [Gulp](https://github.com/gulpjs/gulp).

### Start the local environment

```bash
$ docker-compose build
$ docker-compose run --rm styleguide npm run build
$ docker-compose up
```

Styleguide should be running at the `$(docker-machine ip):3005`. You can access all the individual assets
through the directory view or browse to `/index.html` to see the complete styleguide.

### Watcher

You can launch the development watch with the following command:

```bash
$ docker-compose run --rm styleguide npm dev
```

### Development flow

You should develop your changes in the branches and create a pull request once you're satisfied.
Once merged, you should bump the version number of the styleguide according to the [semantic
versioning](http://semver.org/) and create a new tag with the version number.

In the repository there is a helper script that allows you to easily do this. Just run the following
command with the severity of your change as an argument. This will create a tag automatically to the
git and handle the package.json changes.

```bash
$ ./bump-version.sh <major|minor|patch>
```

## Publication of the styleguide

To publish the styleguide changes you have to build the project at [CircleCI](https://circleci.com/gh/Woorank/woorank-theme).

Successfull build will be automatically pushed into the S3 with the current version number and can be used in the applications.
