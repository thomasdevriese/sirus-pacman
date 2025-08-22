const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const removeCode = require('gulp-remove-code');
const esbuild = require('esbuild');

function html() {
  return gulp.src('index.html').pipe(gulp.dest('build'));
}

function styles() {
  return gulp
    .src('app/style/scss/**/*.scss')
    .pipe(sass())
    .pipe(concat('app.css'))
    .pipe(gulp.dest('build'));
}

function scripts() {
  return esbuild.build({
    entryPoints: ['app/scripts/core/entry.js'],
    bundle: true,
    outfile: 'build/app.js',
    platform: 'browser',
    format: 'esm',
    sourcemap: true,
    minify: true,
    define: {
      'process.env.ACCOUNTNAME': JSON.stringify(process.env.AZURE_ACCOUNTNAME),
      'process.env.CONTAINERNAME': JSON.stringify(process.env.AZURE_BLOBCONTAINERNAME),
      'process.env.LEADERBOARDBLOBNAME' : JSON.stringify(process.env.AZURE_LEADERBOARDBLOBNAME),
      'process.env.SASTOKEN': JSON.stringify(process.env.AZURE_SASTOKEN)
    }
  }).catch((reason) => console.log(reason));
}

function watch() {
  gulp.watch('app/style/**/*.scss', styles);
  gulp.watch('app/scripts/**/*.js', scripts);
}

const build = gulp.parallel(html, styles, scripts);

exports.watch = watch;
exports.default = build;
