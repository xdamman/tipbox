var gulp = require('gulp'),
    gutil = require('gulp-util'), source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    cleanCSS = require('gulp-clean-css');
    mold = require('mold-source-map'),
    rename = require("gulp-rename"),
    sourcemaps = require('gulp-sourcemaps'),
    less = require('gulp-less'),
    path = require('path'),
    hashstream = require('inline-csp-hash'),
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
  return TipboxAppBundler
        .ignore('sodium')
        .bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('tipbox.compiled.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
        loadMaps: true
    }))
    // Add transformation tasks to the pipeline here.
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

gulp.task('minify-css', gulp.series('less', function() {
    return gulp.src('frontend/src/css/tipbox.css')
    .pipe(cleanCSS())
    // .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('frontend/dist/css/'));
}));

gulp.task('inline-hash', () => {
  console.log("Inline Hash")
  return gulp.src('frontend/src/*.html')
    .pipe(hashstream({
      what: 'script',
      replace_cb: (s, hashes) => s.replace(/script-src 'self'[^;]*/, "script-src 'self' " + hashes.join(" "))
    }))
    .pipe(hashstream({
      what: 'style',
      replace_cb: (s, hashes) => s.replace(/style-src 'self'[^;]*/, "style-src 'self' " + hashes.join(" "))
    }))
    .pipe(gulp.dest('./frontend/dist/'))
  ;
});

gulp.task('default', gulp.series('watch', 'less'));
gulp.task('compile', gulp.series('browserify-app', 'browserify-nav', 'minify-css', 'inline-hash'));

gulp.task('copy', gulp.series('compile', function() {
    return gulp.src(filesToCopy, {
        base: './frontend/src/'
    })
    .pipe(gulp.dest('frontend/dist'));
}));

gulp.task('build', gulp.series('copy'));
