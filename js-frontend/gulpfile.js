const gulp = require('gulp')
const { src, dest } = require('gulp')
const path = require('path')


gulp.task('build', function() {
    return (
        src('js/*.js')
            .pipe(dest(path.resolve(__dirname, '../static/frontend/js/')))
    )
})


gulp.task('watch', function() {
    gulp.watch('js/*.js', gulp.series('build'))
})
