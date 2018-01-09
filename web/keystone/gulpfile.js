// Gulp dependencies
const gulp = require('gulp');

// Build dependencies
const babelify =  require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

// Style dependencies
const concatCss = require('gulp-concat-css');
const sass = require('gulp-sass');

// Development dependencies
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const runSequence = require('run-sequence');

// Asset dependencies
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');

//task execution
const exec = require('child_process').exec;


gulp.task('default', function(callback){
	runSequence(['sitestyles', 'sass', 'jslibs', 'es6', 'favico', 'images', 'fonts', 'browserSync', 'watch'], callback )
});

gulp.task('watch', function(){
	gulp.watch('host/templates/**/*.pug', ['browserSync']); //html
	gulp.watch('host/*.js', ['browserSync']); // keystone settings
	gulp.watch('host/updates/*.js', ['browserSync']); // keystone admin
	gulp.watch('host/models/*.js', ['browserSync']); // keystone models
	gulp.watch('host/routes/**/*.js', ['browserSync']); // keystone routes
	gulp.watch('client/src/js/*.js', ['es6']); // bundle.js
	gulp.watch('client/src/js/modules/**/*.js', ['es6']); // front end js
	gulp.watch('client/src/js/libs/*.js', ['jslibs']); // front end libs
	gulp.watch('client/src/customStyles/scss/**/*.scss', ['sass']); //sass
});

// gulp.task('db', function(cb){
// 	  exec('mongod -f ../mongo/config/mongod.conf', function (err, stdout, stderr) {
// 	    console.log(stdout);
// 	    console.log(stderr);
// 	    cb(err);
// 	  });
// });

//task to put all admin files into dist folder
gulp.task('favico', function(){
	return gulp.src('client/src/*.ico')
	.pipe(gulp.dest('client/build'))
});

//task to optimise images + put them in dist folder
gulp.task('images', function(){
	return gulp.src('client/src/images/**/*.+(png|jpg|gif|svg|mp4|ogv|ogg)')
	.pipe(cache(imagemin({
		interlaced: true
	})))
	.pipe(gulp.dest('client/build/images/'))
});

gulp.task('fonts', function(){
	return gulp.src('client/src/fonts/**/*')
	.pipe(gulp.dest('client/build/fonts/'))
});


gulp.task('es6', function() { //transform all code into es2015 format
	browserify('client/src/js/bundle.min.js') //take all code from index.js
	.transform('babelify', { //transform the code using the es2015 preset
		presets: ['es2015'],
	})
	.bundle() //return a stream of code
	.pipe(source('bundle.min.js')) //bundle into a new file name
	.pipe(buffer()) //put all new code into
	.pipe(uglify()) //minifies code
	.pipe(gulp.dest('client/build/js/'))
	.pipe(browserSync.reload({
		stream: true
	})) //build folder
});

gulp.task('jslibs', function(){
	return gulp.src('client/src/js/libs/*.js')
	.pipe(concat('libs.min.js'))
	.pipe(uglify()) //minifies code
	.pipe(gulp.dest('client/build/js/libs/'));
});

//task to turn sass into css and then reload browser
gulp.task('sitestyles', function(){
	return gulp.src('client/src/styles/**/*.+(css|scss)')
    .pipe(gulp.dest('client/build/styles'))
});

//task to turn sass into css and then reload browser
gulp.task('sass', function(){
	return gulp.src('client/src/customStyles/scss/**/*.scss')
	.pipe(sass())
	.pipe(concatCss('styles.min.css'))
    .pipe(gulp.dest('client/build/customStyles/css/'))
    .pipe(browserSync.reload({
		stream: true
	}))
});

// our gulp-nodemon task
gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		script: 'host/keystone.js'
	}).on('start', function () {
		//avoid nodemon being started multiple times
		if (!started) {
			console.log("server started");
			cb();
			started = true;
			setTimeout(function reload(){
				browserSync.reload({
					stream: false
				});
			}, 4000)
		}else{
			console.log("server restarted")
			setTimeout(function reload(){
				browserSync.reload({
					stream: false
				});
			}, 2000)
		}
	})
	.on('crash', function() {
		console.log('nodemon.crash');
	})
	.on('restart', function() {
		console.log('nodemon.restart');
		// browserSync.reload();
	})
	.once('quit', function () {
		// handle ctrl+c without a big weep
		process.exit();
	});
});

gulp.task('browserSync', ['nodemon'], function() {
	browserSync.init(null, {
	    proxy: "http://127.0.0.1:3000",
		port: 4000
    })
	console.log("Browser sync is working");
});
