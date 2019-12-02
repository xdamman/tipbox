var gulp = require('gulp'),
    crypto = require('crypto'),
    fs = require('fs'),
    packageJSON = require(__dirname + '/package.json')
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    cleanCSS = require('gulp-clean-css');
    mold = require('mold-source-map'),
    rename = require("gulp-rename"),
    sourcemaps = require('gulp-sourcemaps'),
    less = require('gulp-less'),
    replace = require('gulp-replace'),
    path = require('path'),
    sriHash = require('gulp-sri-hash'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix');

var version = packageJSON.version;

var filesToCopy = ['frontend/src/index.html', 'frontend/src/img/**/*', 'frontend/src/videos/**/*', 'frontend/src/fonts/**/*', 'frontend/src/js/*.compiled.js', 'frontend/src/js/*.js.map', 'frontend/src/favicon.ico'];

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
    gulp.watch('frontend/src/less/*.less', gulp.series('less'));
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

gulp.task('sri', () => {
  return gulp.src('frontend/dist/index.html')
    // do not modify contents of any referenced css- and js-files after this task...
    .pipe(sriHash())
    // ... manipulating html files further, is perfectly fine
    .pipe(gulp.dest('frontend/dist/'));
});

gulp.task('version', () => {
  console.log("Updating version to ", version);
  return gulp.src('frontend/dist/index.html')
    // do not modify contents of any referenced css- and js-files after this task...
    .pipe(replace('$VERSION$', version))
    // ... manipulating html files further, is perfectly fine
    .pipe(gulp.dest('frontend/dist/'));
});

gulp.task('minify-css', gulp.series('less', function() {
    return gulp.src('frontend/src/css/tipbox.css')
    .pipe(cleanCSS())
    // .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('frontend/dist/css/'));
}));

gulp.task('default', gulp.series('watch', 'less'));
gulp.task('compile', gulp.series('browserify-app', 'browserify-nav', 'minify-css'));

// Output the sha256 hash of the final index.html along with the version

gulp.task('addendum', () => {
    return new Promise(function(resolve, reject) {
        var hash = null
        var algorithm = 'sha256'
            , shasum = crypto.createHash(algorithm)

        // Updating shasum with file content
        var filename = __dirname + "/frontend/dist/index.html"
            , s = fs.ReadStream(filename)
        s.on('data', function (data) {
            shasum.update(data)
        })

        // making digest
        s.on('end', function () {
            hash = shasum.digest('hex')
            console.log("SHA256 for index.html@" + version + " - " + hash)
            resolve()
        })
    });
})

gulp.task('copyKey', () => {
    return new Promise(function(resolve, reject) {
        var serverKeyFile = './data/keys/public.key.json'
        if (process.env["SERVER_PUBLIC_KEY"]) {
            serverKeyFile = process.env["SERVER_PUBLIC_KEY"]
        }
        fs.copyFile(serverKeyFile, 'frontend/src/js/public.key.json', (err) => {
            if (err) throw reject(err)
            console.log('Using ', serverKeyFile, 'as public key.');
            resolve()
        });
    })
})

gulp.task('copy', gulp.series('copyKey', 'compile', function() {
    return gulp.src(filesToCopy, {
        base: './frontend/src/'
    })
    .pipe(gulp.dest('frontend/dist'));
}));

gulp.task('build', gulp.series('copy', 'version', 'sri', 'addendum'));
