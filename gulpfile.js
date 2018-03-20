// Dependencias
var gulp       = require('gulp'),
    uglify     = require('gulp-uglify'),
    clean      = require('gulp-clean'),
    useref     = require('gulp-useref'),
    gulpif     = require('gulp-if'),
    stylus     = require('gulp-stylus'),
    bootstrap  = require('bootstrap-styl'),
    watch      = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    minifyCSS  = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    notify     = require('gulp-notify');

var gulpUtil = require('gulp-util');

// Config path
var config = {
    bowerDir: './bower_components'
}

// Dist folder path
var distFolder = 'dist';

// Delete the dist directory
gulp.task('clean', function() {
    return gulp.src(distFolder)
        .pipe(clean({force: true}));
});

// Compile Stylus to Css Dist
gulp.task('stylus', ['clean'], function () {
    gulp.src('assets/css/main.styl')
        .pipe(stylus({use:bootstrap(), compress: true}))
        .pipe(gulp.dest(distFolder + '/assets/css'));
});

// Compile Stylus to Css Src
gulp.task('stylusSrc', function () {
    gulp.src('assets/css/main.styl')
        .pipe(stylus({use: bootstrap(), compress: true}).on("error", notify.onError({
            message: "<%= error.message %>",
            title: "Erro no Stylus"
        })))
        .pipe(gulp.dest('assets/css'))
        .pipe(livereload());
});

// Concat and Uglify Script/Styles in index.html
gulp.task('assets', ['clean'], function () {
    var assets = useref.assets();
    return gulp.src('index.html')
        .pipe(assets)
        //.pipe(uglify().on('error', gulpUtil.log)) // notice the error event here
        .pipe(gulpif('**/*.js', uglify({mangle: false})))
        .pipe(gulpif('**/*.css', minifyCSS()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(distFolder));
});


// Concat and Uglify Script/Styles in index.html
gulp.task('html', ['clean', 'assets'], function () {
    return gulp.src('dist/index.html')
        // .pipe(minifyHTML({empty: true}))
        .pipe(gulp.dest(distFolder));
});

// Copy other files
gulp.task('copy', ['clean'], function() {

    // Copy fonts
    gulp.src('assets/fonts/**')
        .pipe(gulp.dest(distFolder+'/assets/fonts'));

    // Copy Bootstrap fonts
    gulp.src(config.bowerDir + '/bootstrap/fonts/*.*')
        .pipe(gulp.dest(distFolder + '/assets/fonts'))

    // Copy Font Awesome fonts
    gulp.src(config.bowerDir + '/components-font-awesome/fonts/*.*')
        .pipe(gulp.dest(distFolder + '/assets/fonts'))

    // Copy images
    gulp.src('assets/img/**')
        .pipe(gulp.dest(distFolder+'/assets/img'));

    // Copy other files
    gulp.src('others/**')
        .pipe(gulp.dest(distFolder+'/others'));

});

// Task to build app
gulp.task('build', ['clean', 'assets', 'stylus', 'html', 'copy']);

// Task to watch changes in dev mode
gulp.task('watch', function(){
    livereload.listen();
    gulp.start('stylusSrc');
    watch(['*.html'], function(){
        livereload.reload();
    });
    watch(['assets/css/**/*.styl', 'assets/css/*.styl'], function(){
        gulp.start('stylusSrc');
    });
});
