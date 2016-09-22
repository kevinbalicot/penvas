var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('build', function() {
    browserify('index.js', { debug: true })
        .transform('babelify')
        .bundle()
        .on('error', function (error) { console.error(error.toString()); })
        .pipe(source('app.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);
