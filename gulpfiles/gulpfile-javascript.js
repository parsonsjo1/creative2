var concat = require('gulp-concat');

var gulp = require('gulp');

var uglify = require('gulp-uglify');


var paths = {
    exclude: '!./node_modules/**',
    javascript: './src/**/*.js'
};

var watches = {
    javascript: 'javascript-watch'
}


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

/************************Watch Settings*************************/

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch([paths.javascript,  paths.exclude], [watches.javascript]);
});

gulp.task('default', ['watch'], function () {
    var pathNames = Object.getOwnPropertyNames(paths);
    pathNames.forEach(function(item) {
        console.log("Watching " + item);
    });
});

/************************Watch Settings*************************/