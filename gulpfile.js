// @name gulp-bt-config
//
// @author Gaëtan Bonnot
// @see @GaetanBt on Twitter
// @see gaetanbt.com
//
// @note To do : [x] Try to launch Bower - I'm using gulp-bower
//                   [] Try gulp-bower-files
//                   [] Try gulp-bower-src
//               [x] Concatenate and minify JS files - I don't concatenate JS files because I conditionnaly load jQuery depending on the page
//               [x] Optimize images
// 
// Structure of a basic project:
//
//      == Dev (work in this folder)
//        - css
//        - img
//        - js
//        - scss
//      == Prod (all the compiled - minified - optimized files go there. These are the ones that must be used by the project)
//        - css
//        - img
//        - js
//
// @note Inspired by gulp-config from Gaëtan Ark 
// @see https://github.com/gaetanark/gulp-config/blob/master/gulpfile.js


// Variables
// --------------------
var	gulp       = require('gulp'),

	// Tools
	bower      = require('gulp-bower'),
	clean      = require('gulp-clean'),
	imagemin   = require('gulp-imagemin'),
	livereload = require('gulp-livereload'),
	plumber    = require('gulp-plumber'),
	rename     = require('gulp-rename'),
	sass       = require('gulp-ruby-sass'),
	uglify     = require('gulp-uglify'),
	zip        = require('gulp-zip');


// Paths
// --------------------
var paths = {
	bower_rc:        './prod/vendors/',
	livereload_port:  3000,
	html_files:      './**/*.html',
	php_files:       './**/*.php'

	dev:              {
		folder:           './dev/',
		css:              './dev/css/',
		img:              './dev/img/',
		js:               './dev/js/',
		sass:             './dev/scss/style.scss',
		sass_partials:    './dev/scss/partials/*.scss'
	},
    
	prod:             {
		folder:           './prod/',
		css:              './prod/css/',
		img:              './prod/img/',
		js:               './prod/js/',
	}
};


// Tasks
// --------------------

// Launch Bower
gulp.task('bower', function(){

	// Refers automatically to the bower.json file
	bower(paths.bower_rc);
});

// Clean the production images' folder
gulp.task('clean', function(){
	return gulp.src(paths.prod.img, {read: false})
		.pipe(clean());
});

// Optimize images
gulp.task('images', ['clean'], function(){
	return gulp.src(paths.dev.img + '**/*')
		.pipe(imagemin({read: false}))
		.pipe(gulp.dest(paths.prod.img));
}); 

// Compile Sass files
gulp.task('sass', function(){
	return gulp.src(paths.dev.sass)

		// Prevent streams to be unpiped by errors
		.pipe(plumber())

		// Compiled & readable stylesheet
		.pipe(sass({style: 'expanded'}))
		.pipe(gulp.dest(paths.dev.css))

		// Minified compiled stylesheet
		.pipe(sass({style: 'compressed'}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(paths.prod.css));
});

// Minify all JS files
gulp.task('js', function(){
	return gulp.src(paths.dev.js + '*.js')
        
		//Prevent streams to be unpiped by errors
		.pipe(plumber())
    
		// Show error message when needed
		.pipe(uglify().on('error', function(err){console.warn(err)}))
        
		// Rename minified file & save it in the min folder
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(paths.prod.js));
});

// Zip production files
gulp.task('zip', function(){
	return gulp.src([paths.html_files, paths.php_files, paths.prod.folder + '**/*'])
		.pipe(zip('prod.zip'))
		.pipe(gulp.dest('.'));
});

// Watch files & livereload (require livereload browser extension)
gulp.task('watch', function(){

	// Set up livereload to a specific port (it doesn't work for me without specifying a port)
	var server = livereload(paths.livereload_port);

	// Watch changes to run the Sass task
	gulp.watch([paths.dev.sass, paths.dev.sass_partials], ['sass']);
    
    	// Watch changes on JS files to run the minification task
    	gulp.watch(paths.dev.js + '*.js', ['js']);
    
	// Watch changes of the compiled stylesheet and html files to refresh the page
	gulp.watch([paths.html_files, paths.prod.css + 'style.css']).on('change', function(event){
		server.changed(event.path);
		console.log(event.path + ' has been modified.');
	});
});

// Default task - Lauch bower & clean the project before lauching the sass task
gulp.task('default', ['bower', 'sass', 'js', 'images']);
