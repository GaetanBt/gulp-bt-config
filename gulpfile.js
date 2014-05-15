// @name gulp-bt-config
//
// @author Gaëtan Bonnot
// @see @GaetanBt on Twitter
// @see gaetanbt.com
//
// @note To do : [x] Try to launch Bower - I'm using gulp-bower
//					[] Try gulp-bower-files
//					[] Try gulp-bower-src
//               [x] Concatenate and minify JS files - I don't concatenate JS files because I conditionnaly load jQuery depending on the page
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
	sass       = require('gulp-ruby-sass'),
	uglify     = require('gulp-uglify');


// Paths
// --------------------
var paths = {
	bower_rc:        './vendors',
	css:             './css/',
	js:              './js/',
	js_output:       './js/min/',
	livereload_port:  3000,
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

// Clean the minified folders
gulp.task('clean', function(){
	
	// Clean CSS folder
	gulp.src(paths.css, {read: false})
		.pipe(clean());
    
    // Clean minified JS folder	
	gulp.src(paths.js_output, {read: false})
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

// Minify all JS files
gulp.task('js', function(){
    return gulp.src(paths.js + '*.js')
        
		// Prevent streams to be unpiped by errors
		.pipe(plumber())
    
		// Show error message when needed
		.pipe(uglify().on('error', function(err){console.warn(err)}))
        
		// Rename minified file & save it in the min folder
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(paths.js_output));
});

// Watch files & livereload (require livereload browser extension)
gulp.task('watch', function(){

	// Set up livereload to a specific port (it doesn't work for me without specifying a port)
	var server = livereload(paths.livereload_port);

	// Watch changes to run the Sass task
	gulp.watch([paths.sass, paths.sass_partials], ['sass']);
    
    	// Watch changes on JS files to run the minification task
    	gulp.watch(paths.js + '*.js', ['js']);
    
	// Watch changes of the compiled stylesheet and html files to refresh the page
	gulp.watch(['index.html', paths.css + 'style.css']).on('change', function(event){
		server.changed(event.path);
		console.log(event.path + ' has been modified.');
	});
});

// Default task - Lauch bower & clean the project before lauching the sass task
gulp.task('default', ['bower', 'clean', 'sass', 'js']);
