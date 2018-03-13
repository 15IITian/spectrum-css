var gulp = require('gulp');
var exec = require('child_process').exec;
var replace = require('gulp-replace');
var fs = require('fs');
var path = require('path');
var plumb = require('./lib/plumb.js');

gulp.task('build-docs:topdoc', function(cb) {
  var exePath = path.resolve('node_modules', '.bin', 'topdoc');
  exec(exePath, function (err, stdout, stderr) {
    process.stdout.write('[topdoc] '+stdout);
    process.stderr.write(stderr);
    cb(err);
  });
});

gulp.task('build-docs:inject-topdoc', function() {
  return gulp.src([
    'dist/**/*.css',
    '!dist/vars/*'
  ])
    .pipe(plumb())
    .pipe(replace(/\{\{\s*(.*?)\s*\}}/g, function(match, p1) {
      var filePath = path.resolve('docs', p1);
      return fs.readFileSync(filePath);
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build-docs:copy-site-resources', function() {
  return gulp.src([
    'tasks/resources/docs/**'
  ])
    .pipe(gulp.dest('dist/docs'));
});

gulp.task('build-docs:copy-spectrum-icons', function() {
  return gulp.src([
    'node_modules/@spectrum/spectrum-icons/svg/**',
    'node_modules/@spectrum/spectrum-icons/lib/**'
  ])
    .pipe(gulp.dest('dist/icons/'));
});


gulp.task('build-docs:rewrite-spectrum-icons', function() {
  return gulp.src([
    'dist/icons/*.html'
  ])
    // Use the local copy of spectrum-css
    .pipe(replace('../lib/', ''))
    .pipe(replace('../spectrum-css/', '../'))
    .pipe(gulp.dest('dist/icons/'));
});

gulp.task('build-docs',
  gulp.series(
    'build-docs:inject-topdoc',
    'build-docs:topdoc',
    'build-docs:copy-site-resources',
    'build-docs:copy-spectrum-icons',
    'build-docs:rewrite-spectrum-icons'
  )
);
