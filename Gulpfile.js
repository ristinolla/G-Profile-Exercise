var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

gulp.task('styles', function () {
  return gulp.src('war/src/scss/main.scss')
    .pipe(plumber())
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('war/assets/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('war/assets/css'))
    .pipe(notify({ message: 'Styles Complete'}));
});


//Scripts
gulp.task('scripts', function () {
  return gulp.src([
      'war/src/js/app.js',
			'war/src/js/api-service.js',
      'war/src/js/oauth-service.js',
      'war/src/js/login-controller.js',
      'war/src/js/profile-controller.js',
      'war/src/js/people-controller.js'
    ])
    .pipe(plumber())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('war/assets/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('war/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});


//Library sripts
gulp.task('script-lib', function () {
  return gulp.src([
      'bower_components/angular/angular.min.js',
      'bower_components/angular-route/angular-route.min.js',
      'war/src/vendor/classie/classie.js'
    ])
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('war/assets/vendor'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('war/assets/vendor'))
    .pipe(notify({ message: 'Libs task complete' }));
});

// Img
gulp.task('images',['clean-images'], function() {
  return gulp.src('war/src/img/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('war/assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Modernizer
gulp.task('modernizr', function(){
  return gulp.src('bower_components/modernizr/modernizr.js')
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('war/assets/vendor'))
    .pipe(notify({ message: 'Modernizer moved '}));
});



// Clean
gulp.task('clean', function(cb) {
    del(['war/assets/css', 'war/assets/js'], cb)
});

gulp.task('clean-images', function(cb) {
    del(['war/assets/img'], cb)
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts','script-lib', 'modernizr');
});


gulp.task('build', ['clean', 'clean-images'], function() {
    gulp.start('styles', 'scripts', 'script-lib', 'modernizr', 'images');
});

// Watch
gulp.task('watch', function() {

  gulp.watch('war/src/scss/**/*.scss', ['styles']);
  gulp.watch('war/src/js/**/*.js', ['scripts']);
  gulp.watch('war/src/img/**/*', ['images']);

});
