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

Styleguide should be running at the `$(docker-machine ip):3005`. You can access all the individual assets
through the directory view or browse to `/index.html` to see the complete styleguide.

### Watcher

You can launch the development watch with the following command:

```bash
$ docker-compose run --rm styleguide npm run dev
```

### Development flow

You should develop your changes in the branches and create a pull request where the last commit is
setting the new version number according to the [semantic versioning](http://semver.org/).

You can find a helper script in the repository that allows you to easily do this. Just run the following
command with the severity of your change as an argument. This will create a tag automatically to the
git and handle all the necessary package.json changes.

```bash
$ ./bump-version.sh <major|minor|patch>
```

## Publication of the styleguide

To publish the styleguide changes you have to build the project at [CircleCI](https://circleci.com/gh/Woorank/woorank-theme).

Successfull build will automatically push the woorank-theme assets into the S3 with the current version number and can be used
in the applications. It also will upgrade woo-components package in the npm and the related style
sheet with the same version number than the woorank-theme.

# Woorank React Component Styleguide

This repository also holds the new React component styleguide, made with
[react-styleguidist](https://github.com/sapegin/react-styleguidist).

## Running the styleguide locally

You can find the styleguide at `./woo-components`. To run it locally run the following commands:

```bash
$ cd ./woo-components
$ npm install
$ npm run styleguide-server
```

The styleguide with hot reload should now be running at `http://localhost:3000`

## Running the styleguide in the docker container

*Note*: The hot reloading doesn't work properly with docker-toolbox. It should work on Docker for
Mac, though (please remove the _should_ and _though_ here if you have tested this :).

```bash
$ docker-compose build components
$ docker-compose run --rm --service-ports components
```

Styleguide runs by default at $(docker-machine ip):3006.

## Deploying the styleguide

Follow the instructions for the old styleguide development flow and publication above.
