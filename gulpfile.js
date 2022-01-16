const gulp = require('gulp')
const { src, dest } = require('gulp')
const minify = require('gulp-minify')

const path = require('path')


gulp.task('build', function() {
    return (
        src('js-frontend/*.js')
            .pipe(minify())
            .pipe(dest(path.resolve(__dirname, 'static/frontend/js/')))
    )
})


gulp.task('watch', function() {
    gulp.watch('js-frontend/*.js', gulp.series('build'))
})
