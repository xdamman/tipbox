var gulp = require('gulp'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    minifyCSS = require('gulp-minify-css'),
    uncss = require('gulp-uncss'),
    mold = require('mold-source-map'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    sourcemaps = require('gulp-sourcemaps'),
    less = require('gulp-less'),
    path = require('path'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix');

var filesToCopy = ['frontend/src/*.html', 'frontend/src/img/**/*', 'frontend/src/videos/**/*', 'frontend/src/fonts/**/*', 'frontend/src/js/*.compiled.js', 'frontend/src/js/*.js.map', 'frontend/src/favicon.ico'];

var TipboxAppBundler = browserify({
    entries: ['./frontend/src/js/tipbox.js'],
    debug: true
});

var NavigationBundler = browserify({
    entries: ['./frontend/src/js/navigation.js'],
    debug: true
});

var TipboxAppBundle = function() {
    return TipboxAppBundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('tipbox.compiled.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
        loadMaps: true
    }))
    // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('frontend/src/js/'))
    .on('end', function() {
      gutil.log('Finished JavaScript source bundle.');
    });
};

var NavigationBundle = function() {
    return NavigationBundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('navigation.compiled.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
        loadMaps: true
    }))
    // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('frontend/src/js/'))
    .on('end', function() {
      gutil.log('Finished Navigation source bundle.');
    });
};

gulp.task('browserify-app', TipboxAppBundle);
gulp.task('browserify-nav', NavigationBundle);

gulp.task('less', function(done) {
    var autoprefixPlugin = new LessPluginAutoPrefix({
        browsers: ["last 2 versions"]
    });
    gutil.log('Running less...');
    gulp.src('frontend/src/less/**/*.less')
        .pipe(less({
        paths: [path.join(__dirname, 'less', 'includes')],
        plugins: [autoprefixPlugin]
    }))
    .pipe(gulp.dest('frontend/src/css'))
    .on('end', function() {
        gutil.log('Finished less');
        done();
    });
});

gulp.task('watch', function() {
    gulp.watch('frontend/src/less/*.less', ['less']);
    gulp.watch('frontend/src/**/*.js', function(diff) {
        // avoid infinite loop with browserify changing a .js file
        if (diff.path.match(/navigation.js/)) {
          gutil.log('navigation.js changed. Running browserify-nav');
          return NavigationBundle();
        }
        if (diff.path.match(/compiled.js/)) return;

        gutil.log('JavaScript source changed. Running browserify-app');
        return TipboxAppBundle();
    });
});

gulp.task('copy',['compile'], function() {
    gulp.src(filesToCopy, {
        base: './frontend/src/'
    })
    .pipe(gulp.dest('frontend/dist'));
});

gulp.task('minify-css', ['less'], function() {
    return gulp.src('frontend/src/css/tipbox.css')
        .pipe(uncss({
        html: ['./frontend/src/index.html'],
        ignore: [/\.selected/, /\.active/, /\.encrypted/, /\.slideout-menu/, /\.slideout-open/, /\.slideout-panel/, /\.text-page/, /\.donation-page/, /\.transaction-page/]
    }))
    .pipe(minifyCSS())
    // .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('frontend/dist/css/'));
});

gulp.task('default', ['watch', 'less']);
gulp.task('compile', ['minify-css', 'browserify-app', 'browserify-nav']);
gulp.task('build', ['copy']);
