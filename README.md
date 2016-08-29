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

For example, bumping the version to v6.6.1:

```bash
vim package.json # Change package.json version number to 6.6.1
git add package.json
git commit -m 'v6.6.1'
git tag v6.6.1
git push
git push --tags
```

## Publication of the styleguide

To publish the styleguide changes you have to build the project at [CircleCI](https://circleci.com/gh/Woorank/woorank-theme).

Successfull build will be automatically pushed into the S3 with the current version number and can be used in the applications.
