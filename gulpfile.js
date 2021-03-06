/*------------------------------------------------------------------
// GULP FILE FOR GULP DEV PROJECT
------------------------------------------------------------------*/

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var cache = require('gulp-cache');
var plumberNotifier = require('gulp-plumber-notifier');
var browserSync = require('browser-sync').create();

// Development Test
// -----------------

gulp.task('bruh', function() { //Run 'gulp message' in console to test.
  console.log('Bruh!, your Gulp file is working.');
});

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
      // proxy   : 'http://localhost/YOURDOMAIN' - If your using local as a seve, for example WordPress builds.
    }
  });
});

// Styles
gulp.task('styles', function() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass({ style: 'expanded', }))
    .pipe(plumberNotifier())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(minifycss())
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('src/dist/styles/'))
    .pipe(notify({ message: 'Styles task completed' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(uglify())
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('src/dist/scripts/'))
    .pipe(notify({ message: 'Scripts task completed' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('src/imgs/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('src/dist/imgs/'))
    .pipe(notify({ message: 'Images task completed' }));
});

// Web Files
gulp.task('web', function() {
  return gulp.src('src/**/*.html')
    .pipe(plumberNotifier())
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('dist/'))
    .pipe(notify({ message: 'Web files move task completed' }));
});

// Clean
gulp.task('clean', function() {
  return gulp.src(['src/dist/styles/', 'src/dist/scripts/', 'src/dist/imgs/', 'src/dist/web'], {read: false})
    .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.run('styles', 'scripts', 'imgs', 'web');
});

gulp.task('watch', ['browserSync', 'styles', 'images', 'scripts', 'clean', 'web'], function(){
  gulp.watch('src/scss/**/*.scss', ['styles']);
  gulp.watch('src/**/**/*.html', browserSync.reload);
  gulp.watch('src/scripts/**/*.js', browserSync.reload);
  gulp.watch('src/imgs/**/*', browserSync.reload);
  console.log('...checked the files, and now I\'m watching them');
});