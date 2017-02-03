var buffer = require('vinyl-buffer');

var gulp = require('gulp');

var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');

var ts = require("gulp-typescript");
var tsify = require("tsify");

/*-------------------------------------------*/

var paths = {
    exclude: '!./node_modules/**',
    typescript: './src/**/*.ts'
};

var watches = {
    typescript: 'typescript-watch'
}


/************************Typescript*****************************/

gulp.task('typescript', function() {
    return bundle();
});

gulp.task(watches.typescript, ['typescript'], function() {
    browserSync.reload();
    console.log("typescript reload complete");
});

var browserify = browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify);

function babelify() {
    return browserify
    .transform('babelify', {
        presets: ['es2015'],
        extensions: ['.ts']
    });
}

function bundle() {
    return babelify()
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
}

/************************Typescript*****************************/

/************************Watch Settings*************************/

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch([paths.typescript,  paths.exclude], [watches.typescript]);
});

gulp.task('default', ['watch'], function () {
    var pathNames = Object.getOwnPropertyNames(paths);
    pathNames.forEach(function(item) {
        console.log("Watching " + item);
    });
});

/************************Watch Settings*************************/