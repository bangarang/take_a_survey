// gulpfile.js
// Include gulp
var gulp = require('gulp');

var jshint = require('gulp-jshint'),
    path = require('path'),
    buffer = require('vinyl-buffer');
  	sass = require('gulp-sass'),
  	concat = require('gulp-concat'),
  	uglify = require('gulp-uglify'),
  	rename = require('gulp-rename'),
  	nodemon = require('gulp-nodemon'),
    browserify = require('browserify'),
    babelify = require("babelify"),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    folders = require('gulp-folders'),
    destFolder = './public/js/',
    minifyCSS = require('gulp-minify-css'),
    streamify = require('gulp-streamify');


// npm install --saveDev gulp gulp-jshint path vinyl-buffer gulp-sass gulp-concat gulp-uglify gulp-rename gulp-nodemon browserify reactify vinyl-source-stream gulp-sourcemaps gulp-autoprefixer gulp-folders gulp-minify-css gulp-streamify

gulp.task('build-question', function(){

    return browserify('./components/question.jsx')
        .transform("babelify", {presets: ["es2015", "react"]})
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest(destFolder));
});

gulp.task('build-admin', function(){

    return browserify('./components/admin.jsx')
        .transform("babelify", {presets: ["es2015", "react"]})
        .bundle()
        .pipe(source('admin.js'))
        .pipe(gulp.dest(destFolder));
});


gulp.task('build-reacts-production', function(){

    return browserify('./components/index.jsx')
        .transform("babelify", {presets: ["es2015", "react"]})
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('js/'))
        .pipe(streamify(uglify()))
        .pipe(rename('index.min.js'))
        .pipe(gulp.dest(destFolder));
});

// Compile Our Production Sass
gulp.task('build-styles-production', function() {
  return gulp.src('./public/scss/*.scss')
          .pipe(sass({
            style: 'compact'
          }))
          .pipe(autoprefixer())
          .pipe(rename('main.min.css'))
          .pipe(minifyCSS({keepBreaks:false}))
          .pipe(gulp.dest('./public/stylesheets'))

});

// Compile Our for Development
gulp.task('build-styles', function() {

  return gulp.src('./public/scss/*.scss')
          .pipe(sourcemaps.init())
            .pipe(sass({
              errLogToConsole: true,
              style: 'expanded'
            }))
          .pipe(sourcemaps.write())
          .pipe(autoprefixer())
          .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


gulp.task('server', function () {
  nodemon({ script: './bin/www', ext: 'js', ignore: ['ignored.js'], stdout: true })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!')
    })
})



// Watch Files For Changes
gulp.task('watch', function() {
    // livereload.listen();
    gulp.watch('components/**/*.jsx', ['build-admin', 'build-question']);
    gulp.watch('public/scss/**/*.scss', ['build-styles']);
});

// Default Task
gulp.task('default', ['build-styles', 'build-admin', 'build-question', 'server', 'watch' ]);
gulp.task('build', ['build-styles-production', 'build-styles', 'build-reacts', 'build-reacts-production' ]);
