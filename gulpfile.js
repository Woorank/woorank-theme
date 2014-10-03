var gulp = require('gulp'),
    less = require('gulp-less');

gulp.task('less', function () {
  return gulp.src('./bootstrap.less')
    .pipe(less())
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['less'], function () {
  return gulp.watch('./**/*.less', ['less']);
});

gulp.task('default', ['less']);
