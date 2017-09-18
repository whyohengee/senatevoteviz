const gulp    = require('gulp'),
      connect = require('gulp-connect'),
      sass    = require('gulp-sass'),
      watch   = require('gulp-watch')

//server task
gulp.task('server', function () {
  connect.server({
    livereload: true
  })
})

//html updates
gulp.task('html', function () {
  return gulp.src("*.html")
             .pipe(connect.reload())
})

//compile scss to css
gulp.task('sass', function () {
  return gulp.src('./scss/*.scss')
             .pipe(sass())
             .pipe(gulp.dest('./css'))
})

gulp.task('js', function () {
  return gulp.src('./js/*.js')
             .pipe(connect.reload())
})

//livereload only changed files
gulp.task('livereload', function () {
  return gulp.src('./css/*.css')
             .pipe(watch('./css/*.css'))
             .pipe(connect.reload())
})

//watch tasks...don't think I need these if
//I'm connect.reload() on the separate tasks.
//Can I set multiple sources on the livereload task?
gulp.task('watch', function () {
  gulp.watch('*.html', ['html'])
  gulp.watch('./scss/*.scss', ['sass'])
  gulp.watch('./js/*.js', ['js'])
})


//default task
// gulp.task('default', ['server', 'html', 'sass', 'livereload'])
gulp.task('default', ['server', 'html', 'sass', 'livereload', 'watch'])