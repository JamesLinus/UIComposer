// jshint devel:true

// TODO:
// 1. Clean up to standardize code formating.
// 2. Split up the file up into different modules.

(function() {
  "use strict";

  // Require all necessary gulp plugins
  var
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    consolidate = require('gulp-consolidate'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    jshintStylish = require('jshint-stylish'),
    jsonSass = require('gulp-json-sass'),
    preprocess = require('gulp-preprocess'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util');

  var config = {
    version: '2.2.0',
    build: 'dist',
  };

  // Clean up asset folder
  gulp.task('clean', function(cb) {
    del(config.build, cb);
  });

  // update version
  gulp.task('update-version', function() {

    // Ruby version
    gulp.src('source/templates/_version.rb')
      .pipe(consolidate('lodash', {"version": config.version}))
      .pipe(rename('version.rb'))
      .pipe(gulp.dest('lib/acl-ui/'));

    // bower.json version
    gulp.src('source/templates/_bower.json')
      .pipe(consolidate('lodash', {"version": config.version}))
      .pipe(rename('bower.json'))
      .pipe(gulp.dest(''));

    // package.json version
    gulp.src('source/templates/_package.json')
      .pipe(consolidate('lodash', {"version": config.version}))
      .pipe(rename('package.json'))
      .pipe(gulp.dest(''));
  });

  // Compile json object to sass color variables.
  gulp.task('build-colors', function() {
    return gulp
      .src('vendor/assets/shared/base-colors.json')
      .pipe(jsonSass())
      .pipe(rename('_base-colors.scss'))
      .pipe(gulp.dest('vendor/assets/stylesheets/partials/'));
  });

  // Compile Sass
  gulp.task('build-css-prod', function() {
    return gulp.src('source/compiled-css.scss')
      .pipe(sass({
        includePaths: ['bower_components/bower-foundation/scss'],
        outputStyle: 'compressed'
      }).on('error', sass.logError))
      .pipe(concat('acl-ui.min.css'))
      .pipe(gulp.dest(config.build + '/' + config.version + '/assets/css'));
  });

  // Compile Sass-dev
  gulp.task('build-css-dev', function() {
    return gulp.src('compiled-css.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        includePaths: ['bower_components/bower-foundation/scss']
      }).on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(concat('acl-ui.css'))
      .pipe(gulp.dest(config.build + '/test/assets/css'));
  });

  // Compile JS
  gulp.task('build-js-prod', function() {
    return gulp.src([
      'bower_components/bower-foundation/js/**/*.js',
      'vendor/assets/javascripts/**/*.js'
    ])
      .pipe(concat('acl-ui.min.js'))
      .pipe(uglify().on('error', gutil.log))
      .pipe(gulp.dest(config.build + '/' + config.version + '/assets/js'));
  });

  // Prep icons font
  gulp.task('build-fonts', function() {
    return gulp.src([
      'app/assets/**/fonts/**/*.*'
    ])
      .pipe(gulp.dest(config.build + '/' + config.version + '/assets'));
  });

  // Copy font files from acl-icon-font
  gulp.task('get-fontfiles', function() {
    return gulp.src([
      'bower_components/acl-icon-font/dist/fonts/*.*'
    ])
      .pipe(gulp.dest('app/assets/fonts'));
  });

  // Copy acl-icon-font scss
  gulp.task('get-fontscss', function() {
    return gulp.src([
      'bower_components/acl-icon-font/dist/css/acl-icon-font.scss'
    ])
      .pipe(gulp.dest('vendor/assets/stylesheets/vendor'));
  });

  gulp.task('get-fontstatic', function(cb) {
    runSequence(
      'get-fontfiles',
      'get-fontscss',
      cb);
  });

  // Watching and compile for local testing.
  gulp.task('watch', function() {
    gulp.watch([
      'bower_components/bower-foundation/scss/**/*.scss',
      'vendor/assets/stylesheets/**/*.scss',
      'compiled-css.scss'],
      ['clean', 'build-css-dev']);
  });

  gulp.task('default', function(cb) {
    runSequence(
      'clean',
      'build-colors',
      'build-css-prod',
      'build-js-prod',
      'build-fonts',
      'get-fontstatic',
      'update-version',
      cb);
  });
})();
