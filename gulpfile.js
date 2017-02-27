////////////////////////////////////////////////////////////////////////////////
// Copyright (c) 2015-2017 Rick Wargo. All Rights Reserved.
//
// Licensed under the MIT License (the "License"). You may not use this file
// except in compliance with the License. A copy of the License is located at
// http://opensource.org/licenses/MIT or in the "LICENSE" file accompanying
// this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
// OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.
////////////////////////////////////////////////////////////////////////////////

/*jslint node: true */
'use strict';

var gulp = require('gulp-help')(require('gulp')),
    jslint = require('gulp-jslint'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    env = require('gulp-env'),
    shell = require('gulp-shell'),
    server = require('./server');


var filePaths = {
    lintFiles: ['./*.js', 'lib/**/*.js', 'routes/**/*.js', 'test/**/*.js'],
    sassInput: ['./stylesheets/**/*.scss'],
    cssOutput: './public_html/css',
    sourceMaps: './',
    coverFiles: ['./*.js', 'lib/**/*.js', 'routes/**/*.js', '!gulpfile.js'],
    unitTestFiles: ['./*.js', 'lib/**/*.js', 'routes/**/*.js', 'test/**/*.js'],
    coverTestFiles: ['test/**/test_*.js']
};

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

gulp.task('default', ['help']);

gulp.task('make-cert', 'Generate x509 SSL Certificate', shell.task([
    'openssl genrsa -out sslcert/private-key.pem 1024',
    'openssl req -new -x509 -key sslcert/private-key.pem -out sslcert/cert.cer -days 365'
]), {
    aliases: ['cert']
});

gulp.task('check-cert', 'Check x509 SSL certificate verification', shell.task([
    'openssl x509 -noout -text -in sslcert/cert.cer'
]));

gulp.task('lint', 'Lints all server side js', function () {
    return gulp.src(filePaths.lintFiles)
        .pipe(jslint({ /* this object represents the JSLint directives being passed down */ }))
        .pipe(jslint.reporter('stylish'));
});

gulp.task('test-mock', 'Run unit tests against local server **', function () {
    var result,
        envs = env.set({});

    result = gulp.src(filePaths.unitTestFiles)
        .pipe(envs)
        .pipe(mocha({/*reporter: 'progress'*/}));
    return result;
}, {
    aliases: ['test']
});

gulp.task('test-local', 'Run unit tests against local server **', function () {
    var result,
        envs = env.set({
            SERVER: 'Local'
        });

    server.start();
    result = gulp.src(filePaths.unitTestFiles)
        .pipe(envs)
        .pipe(mocha({/*reporter: 'progress'*/}))
        .on('end', function () {
            server.stop();
        });
    return result;
});


gulp.task('test-and-cover', 'Show coverage for tested code **', function () {
    var envs = env.set({SERVER: 'Local'});

    server.start();
    gulp.src(filePaths.coverFiles)
        .pipe(envs)
        // Covering files
        .pipe(istanbul({includeUntested: true}))
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());

    return gulp.src(filePaths.coverTestFiles)
        .pipe(mocha({/*reporter: 'progress'*/}))
        .pipe(istanbul.writeReports())  // Creating the reports after tests ran
        .pipe(istanbul.enforceThresholds({thresholds: {global: 90}}))  // Enforce a coverage of at least 90%
        .on('end', function () {
            server.stop();
        });
}, {
    aliases: ['cover']
});

gulp.task('watch-test', 'Watch for changed files and run unit tests when a file changes', function () {
    return gulp.watch(filePaths.unitTestFiles, ['test-mock']);
});

gulp.task('watch-lint', 'Watch for changed files and run lint of the file that has changed', function () {
    return gulp
        .watch(filePaths.lintFiles)
        .on('change', function (file) {
            gulp.src(file.path)
                .pipe(jslint({ /* this object represents the JSLint directives being passed down */ }))
                .pipe(jslint.reporter('stylish'))
                .on('error', function () {
                    return;  // jslint spits out errors -- keep here so watcher doesn't die
                });
        });
});

function scss(gulp, files) {
    return gulp
        .src(files)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.write(filePaths.sourceMaps))
        .pipe(gulp.dest(filePaths.cssOutput));
}

gulp.task('watch-scss', 'Watch for changed .scss files and run scss of the file that has changed', function () {
    return gulp
        .watch(filePaths.sassInput, ['sass'])
        // When there is a change log a message in the console
        .on('change', function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running scss...');
            return scss(gulp, event.path);
        });
}, {
    aliases: ['watch-sass']
});

gulp.task('watch', 'Watch files for changes and take appropriate actions based on file type', ['watch-lint', 'watch-test', 'watch-scss']);

gulp.task('scss', 'Convert .scss file to .css and place in public_html/css directory (with source maps)', function () {
    return scss(gulp, filePaths.sassInput);
}, {
    aliases: ['sass']
});

gulp.task('scss-prod', 'Convert .scss file to .css and place in public_html/css directory (production quality)', function () {
    return gulp
        .src(filePaths.sassInput)
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(filePaths.cssOutput));
}, {
    aliases: ['sass-prod']
});
