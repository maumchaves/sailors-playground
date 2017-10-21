var gulp = require('gulp'),
    ejs = require("gulp-ejs"),
    htmlmin = require("gulp-htmlmin"),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    uglifyes = require('gulp-uglify-es').default,
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    del = require('del');

    var ejs = require("gulp-ejs")
    
gulp.task('templates', function() {
  return gulp.src(['src/index.ejs', 'src/pages/**/*.ejs'])
    .pipe(ejs())
    .pipe(htmlmin())
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest("./dist"))
});

gulp.task('styles', function() {
  return sass('src/styles/main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('assets', function() {
  return gulp.src(['src/assets/**/*.png', 'src/assets/**/*.jpg', 'src/assets/*.ico'])
    .pipe(gulp.dest('dist/assets'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('scripts', function() {
  return gulp.src([
      // Dependencies 
      'node_modules/bootstrap/js/dist/util.js',
      'node_modules/bootstrap/js/dist/modal.js',
      // Custom
      'src/js/**/*.js'
    ])
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglifyes())
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('build', ['clean'], function() {
  gulp.start('templates', 'styles', 'scripts', 'assets');
});

gulp.task('watch', function() {
  
    // Watch .ejs files
    gulp.watch(['src/index.ejs', 'src/pages/**/*.ejs', 'src/partials/**/*.ejs'],
               ['templates']);

    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);
  
    // Watch .js files
    gulp.watch('src/js/**/*.js', ['scripts']);
  
    // Watch assets files
    gulp.watch(['src/assets/**/*.png', 'src/assets/**/*.jpg', 'src/assets/*.ico'],
               ['assets']);

    // Create LiveReload server
    livereload.listen();
  
    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
  
  });