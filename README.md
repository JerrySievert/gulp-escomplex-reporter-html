# Gulp ESComplex Reporter - HTML

An HTML reporter for `gulp-escomplex`.

## Installing

```
$ npm install --save-dev gulp-escomplex gulp-escomplex-reporter-json
```

## Usage

```
var gulp = require('gulp');
var complexity = require('gulp-escomplex');
var reporter = require('gulp-escomplex-reporter-html');

gulp.task('complexity', function () {
  return gulp.src([
    'index.js',
    'gulpfile.js'
  ],
  {
    base: __dirname
  })
  .pipe(complexity())
  .pipe(reporter())
  .pipe(gulp.dest("complexity"));
});
```
