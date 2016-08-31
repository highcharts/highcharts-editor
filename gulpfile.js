var dest = 'dist/',
    electronDest = 'app/',
    wpPluginDest = 'integrations/wordpress/highcharts-editor/',
    packageJson = require('./package.json'),
    name = 'highcharts-editor',
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    electron = require('gulp-electron'),
    jshint = require('gulp-jshint'),
    zip = require('gulp-zip'),
    //The order is important, so we don't do wildcard
    sources =[
        "./src/highcharts-editor.js",
        "./src/highed.dom.js",
        "./src/highed.events.js",
        "./src/highed.editor.js",
        "./src/highed.dimmer.js",
        "./src/highed.overlaymodal.js",
        "./src/highed.hsplitter.js",
        "./src/highed.tabcontrol.js",
        "./src/highed.inspector.js",
        "./src/highed.inspector.field.js",
        "./src/highed.list.js",
        "./src/meta/highed.meta.charts.js",
        "./src/meta/highed.meta.options.extended.js",
        "./src/meta/highed.meta.colors.js",
        "./src/meta/highed.meta.fonts.js",
        "./src/highed.chart.template.selector.js",
        "./src/highed.chart.customizer.js",
        "./src/highed.wizstepper.js",
        "./src/highed.toolbar.js",
        "./src/highed.wizbar.js",
        "./src/highed.colorpicker.js",
        "./src/highed.fontpicker.js",
        "./src/highed.pushbutton.js",
        "./src/highed.tooltip.js",
        "./src/highed.snackbar.js",
        "./src/highed.dataimporter.js",
        "./src/highed.fileupload.js",
        "./src/highed.tree.js",
        "./src/highed.exporter.js",
        "./src/highed.modaleditor.js"
    ]
;

gulp.task('less', function () {
    return gulp.src('less/theme.default.less')
               .pipe(less({
                    paths: ['less/'],
                    compress: true 
               }))
               .pipe(rename(name + '.min.css'))
               .pipe(gulp.dest(dest))
               .pipe(gulp.dest(electronDest))
               .pipe(gulp.dest(wpPluginDest))
    ; 
});

gulp.task('plugins', function () {
    return gulp.src('plugins/*.js')
               //.pipe(concat(name + '.js'))
              // .pipe(gulp.dest(dest))               
               //.pipe(rename(name + '.min.js'))
               .pipe(uglify())
               .pipe(gulp.dest(dest + 'plugins'))
    ;
});

gulp.task('wordpress', ['less', 'minify'], function () {
    return gulp.src(wpPluginDest + '*')
               .pipe(zip(name + '.wordpress.zip'))
               .pipe(gulp.dest(dest))
    ;
});


gulp.task('minify', function () {
    return gulp.src(sources)
               .pipe(concat(name + '.js'))
               .pipe(gulp.dest(dest))               
               .pipe(rename(name + '.min.js'))
               .pipe(uglify())
               .pipe(gulp.dest(dest))
               .pipe(gulp.dest(electronDest))
               .pipe(gulp.dest(wpPluginDest))
    ;
});

gulp.task('electron', ['less', 'minify'], function () {
    return gulp.src('')
               .pipe(electron({
                    src: './app',
                    packageJson: {
                        name: packageJson.name,
                        version: packageJson.version
                    },
                    release: './dist/electron',
                    cache: './cache',
                    version: 'v1.3.4',
                    packaging: true,
                    platforms: ['win32-ia32', 'darwin-x64'],
                    platformResources: {
                        darwin: {
                            CFBundleDisplayName: packageJson.name,
                            CFBundleIdentifier: packageJson.name,
                            CFBundleName: packageJson.name,
                            CFBundleVersion: packageJson.version,
                            icon: false
                        },
                        win: {
                            "version-string": packageJson.version,
                            "file-version": packageJson.version,
                            "product-version": packageJson.version,
                            "icon": false
                        }
                    }
               }))
               .pipe(gulp.dest(''))
    ;
});

gulp.task('tinymce', function () {
    return gulp.src(sources.concat('integrations/tinymce.js'))
               .pipe(concat(name + '.tinymce.js'))
               .pipe(gulp.dest(dest))
               .pipe(rename(name + '.tinymce.min.js'))
               .pipe(uglify())
               .pipe(gulp.dest(dest))
    ;
});

gulp.task('default', function () {
    gulp.start('minify', 'tinymce', 'less', 'plugins', 'wordpress');
});