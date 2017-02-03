var browserify = require("browserify");
var browserSync = require('browser-sync').create();

var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');

var gulp = require('gulp');

var sass = require('gulp-sass');

var uglify = require('gulp-uglify');

/*-------------------------------------------*/

var paths = {
    exclude: '!./node_modules/**',
    html: './src/**/*.html',
    images: './src/images/*.*',
    sass: './src/**/*.scss',
    typescript: './src/**/*.js'
};

var watches = {
    html: 'html-watch',
    images: 'images-watch',
    sass: 'sass-watch',
    javascript: 'javascript-watch'
}



/************************BrowserSync****************************/

gulp.task('browser-sync', [watches.html,watches.images,watches.typescript,watches.sass], function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

/************************BrowserSync****************************/



/************************HTML Section***************************/

gulp.task("copy-html", function () {
    return  gulp.src([paths.html, paths.exclude])
            .pipe(gulp.dest("./dist"));
});

gulp.task(watches.html, ['copy-html'], function() {
    browserSync.reload();
    console.log("html reload complete");
});

/************************HTML Section***************************/


/************************Javascript*****************************/

gulp.task('javascript', function() {
     return  gulp.src([paths.javascript, paths.exclude])
            .pipe(concat('all.js'))
            .pipe(gulp.dest("./dist"));
});

gulp.task(watches.javascript, ['javascript'], function() {
    browserSync.reload();
    console.log("javascript reload complete");
});

/************************Javascript*****************************/


/************************Images*********************************/

gulp.task("copy-images", function () {
    return  gulp.src([paths.images, paths.exclude])
            .pipe(gulp.dest("./dist/images"));
});

gulp.task(watches.images, ['copy-images'], function() {
    browserSync.reload();
    console.log("images reload complete");
});

/************************Images***************************/



/************************Sass***********************************/

gulp.task('copy-sass', function () {
  return gulp.src([paths.sass, paths.exclude])
    .pipe(concat('all.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
});

gulp.task(watches.sass, ['copy-sass'], function() {
    browserSync.reload();
    console.log("sass reload complete");
});

/************************Sass***********************************/



/************************Watch Settings*************************/

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch([paths.html,        paths.exclude], [watches.html]);
    gulp.watch([paths.javascript,  paths.exclude], [watches.javascript]);
    gulp.watch([paths.sass,        paths.exclude], [watches.sass]);
});

gulp.task('default', ['watch'], function () {
    var pathNames = Object.getOwnPropertyNames(paths);
    pathNames.forEach(function(item) {
        console.log("Watching " + item);
    });
});

/************************Watch Settings*************************/