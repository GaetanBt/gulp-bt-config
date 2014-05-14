// @name gulp-bt-config
//
// @author Gaëtan Bonnot
// @see @GaetanBt on Twitter
// @see gaetanbt.com
//
// @note To do : [x] Try to launch Bower - I'm using gulp-bower
//					[] Try gulp-bower-files
//					[] Try gulp-bower-src
//               [] Concatenate and minify JS files
//               [] Optimize images
// 
// @note Inspired by gulp-config from Gaëtan Ark 
// @see https://github.com/gaetanark/gulp-config/blob/master/gulpfile.js


// Variables
// --------------------
var	gulp       = require('gulp'),

	// Tools
	bower      = require('gulp-bower'),
	clean      = require('gulp-clean'),
	livereload = require('gulp-livereload'),
	plumber    = require('gulp-plumber'),
	rename     = require('gulp-rename'),
	sass       = require('gulp-ruby-sass');


// Paths
// --------------------
var paths = {
	bower_rc:        './vendors',
	css:             './css/',
	livereload_port: '3000',
	sass:            './scss/style.scss',
	sass_partials:   './scss/partials/*.scss'
};


// Tasks
// --------------------

// Launch Bower
gulp.task('bower', function(){
	
	// Refers automatically to the bower.json file
	bower(paths.bower_rc);
});

// Clean the minified stylesheet folder
gulp.task('clean', function(){
	gulp.src(paths.css, {read: false})
		.pipe(clean());
});

// Compile Sass files
gulp.task('sass', function(){
	return gulp.src(paths.sass)

		// Prevent streams to be unpiped by errors
		.pipe(plumber())

		// Compiled & readable stylesheet
		.pipe(sass({style: 'expanded'}))
		.pipe(gulp.dest('css/'))

		// Minified compiled stylesheet
		.pipe(sass({style: 'compressed'}))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest(paths.css));
});

// Watch files & livereload (require livereload browser extension)
gulp.task('watch', function(){

	// Set up livereload to a specific port (it doesn't work for me without specifying a port)
	var server = livereload(paths.livereload_port);

	// Watch changes to run the Sass task
	gulp.watch([paths.sass, paths.sass_partials], ['sass']);

	// Watch changes of the compiled stylesheet and html files to refresh the page
	gulp.watch(['index.html', paths.css + 'style.css']).on('change', function(event){
		server.changed(event.path);
		console.log(event.path + ' has been modified.');
	});
});

// Default task - Lauch bower & clean the project before lauching the sass task
gulp.task('default', ['bower', 'clean', 'sass']);
