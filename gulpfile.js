"use strict";

// Load Gulp
const { src, dest, task, watch, series, parallel } = require("gulp"),

        browserSync               = require("browser-sync").create(),
        webpack                   = require('webpack-stream'),
        modernizr                 = require('gulp-modernizr'),

        imagemin                  = require('gulp-imagemin'),
        imageminPngquant          = require('imagemin-pngquant'),
        imageminMozjpeg           = require('imagemin-mozjpeg'),
        cssnano                   = require('cssnano'),
        uglify                    = require('gulp-uglify'),
        RevAll                    = require('gulp-rev-all'),
        inject                    = require('gulp-inject'),

        // css
        autoprefixer              = require("autoprefixer"),
        postcss                   = require("gulp-postcss"),
        sass                      = require("gulp-sass"),
        nested                    = require("postcss-nested"),
        cssImport                 = require("postcss-import"),
        mixins                    = require("postcss-mixins"),
        responsiveType            = require("postcss-responsive-type"),
        postcssCustomProperties   = require("postcss-custom-properties"),
        simpleVars                = require("postcss-simple-vars"),
        each                      = require("postcss-each"),
        functions                 = require("postcss-functions"),
        conditionals              = require("postcss-conditionals"),
        zIndex                    = require("postcss-zindex"),
   
        svgSprite                 = require("gulp-svg-sprite"),
        svg2png                   = require("gulp-svg2png"),
        rename                    = require("gulp-rename"),
        plumber                   = require( 'gulp-plumber' ),
        del                       = require("del"),
    
        // Project related variables
        styleSRC                  = './app/assets/styles/styles.css',
        styleURL                  = './app/temp/styles',
    
        htmlSRC                   = './app/index.html',
        htmlURL                   = './app/temp/',
    
        jsAppSRC                  = './app/assets/scripts/App.js',
        jsVendorSRC               = './app/assets/scripts/vendors/Vendor.js',
        jsURL                     = './app/temp/scripts/',
        //jsBundleName            = 'App.bundle.js',
        //jsFiles                 = [ jsAppSRC, jsVendor ],
      
        styleWatch                = './app/assets/styles/**/*.css',
        htmlWatch                 = './app/**/*.html',
        jsWatch                   = './app/assets/scripts/**/*.js',
    
        // Gulp SVG Sprite Config
        spriteConfig = {    
            shape: {
                spacing: {
                    padding: 1
                }
            },
            mode: {
                css: {
                    variables: {
                        replaceSvgWithPng: () => {
                            return (sprite, render) => {
                                return render(sprite).split('.svg').join('.png');
                            }
                        }
                    },
                    sprite: "sprite.svg",
                    render: {
                        css: {
                            template: "./gulp/templates/sprite.css"
                        }
                    }
                }
            }
        };

// Server -------------------------------------------
function browser_sync(done) {
	browserSync.init({
        notify: false,
		server: {
            baseDir: ["./app"]
            //baseDir: ["./", "./app"]
        }
	});
	
	done();
}

function reload(done) {
    browserSync.reload();
    done();
}

function triggerPlumber( src_file, dest_file ) {
	return src( src_file )
		.pipe( plumber() )
		.pipe( dest( dest_file ) );
}

// Styles Task -------------------------------------------
function styles() {
    return src(styleSRC)
        //.pipe(rename({ suffix: ".min" }))
        .pipe(
            postcss([
                cssImport,
                mixins,
                each,
                functions,
                conditionals,
                simpleVars,
                postcssCustomProperties,
                zIndex,
                responsiveType,
                nested,
                autoprefixer,
                cssnano()
            ])
        )

        .on("error", function (errorInfo) {
            console.log(errorInfo.toString());
            this.emit("end");
        })

        .pipe(dest( styleURL ))
        .pipe( browserSync.stream() );
}

// Scripts Task -------------------------------------------
function scripts() {
    return src( jsAppSRC )
        .pipe(webpack(
            {
                // Gulp configuration
                entry: {
                    App: jsAppSRC,
                    "vendors/Vendor": jsVendorSRC,
                },
                output: {
                    filename: '[name].js' // for the default name 'main.js' in [webpack 4].
                },
                mode: 'production', // | 'development' | 'none'

                // Babel configuration
                module: {
                    rules: [
                        {
                            test: /\.js$/,
                            exclude: /node_modules/,
                            use: {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env']
                                }
                            }
                        }
                    ]
                }
            }
        ))
        .pipe(uglify())

        .on("error", function(err, stats, callback) {
            if (err) {
                console.log(err.toString());
                this.emit("end");
              }

              console.log(stats.toString());
              callback();
        })
        
        .pipe(dest(jsURL))
        .pipe( browserSync.stream() );
}

// HTML Task -------------------------------------------
function html() {
	return triggerPlumber( htmlSRC, htmlURL );
}

// Spirtes Task -------------------------------------------
function beginClean() {
    return del(['./app/temp/sprite', './app/assets/images/sprites']);
}

function createSprite() {
    return src('./app/assets/images/icons/**/*.svg')
        .pipe(svgSprite(spriteConfig))
        .pipe(dest('./app/temp/sprite/'));
        
}

function createPngCopy() {
    return src('./app/temp/sprite/css/*.svg')
        .pipe(svg2png())
        .pipe(dest('./app/temp/sprite/css'));
}

function copySpriteGraphic() {
    return src('./app/temp/sprite/css/**/*.{svg,png}')
        .pipe(dest('./app/assets/images/sprites'));
}

function copySpriteCSS() {
    return src('./app/temp/sprite/css/*.css')
        .pipe(rename('_sprite.css'))
        .pipe(dest('./app/assets/styles/modules'));
}

function endClean() {
    return del('./app/temp/sprite');
}

// Modernizr -------------------------------------------

function modernizrTask() {
    const paths = [
        "./app/assets/styles/**/*.css",
        "./app/assets/scripts/**/*.js"
    ];
    return src(paths)
        .pipe(modernizr({
            "options": [
                "setClasses"
            ]
        }))

        .pipe(dest(jsURL));
}

// Build -------------------------------------------

const buildDir = './docs';

function deleteDistFolder() {
    return del(buildDir);
}

function copyGeneralFiles() {
    const pathsToCopy = [
        './app/**/*',
        '!./app/index.html',
        '!./app/assets/images/**',
        '!./app/assets/styles/**',
        '!./app/assets/scripts/**',
        '!./app/temp',
        '!./app/temp/**'
    ];
    return src(pathsToCopy)
        .pipe(dest(buildDir));
}

function optimizeImages() {
    const imagesPaths = [
        './app/assets/images/**/*',
        '!./app/assets/images/icons',
        '!./app/assets/images/icons/**/*'
    ];
    return src(imagesPaths)
        .pipe(imagemin([
            //imagemin.jpegtran({progressive: true}),
            imagemin.gifsicle({interlaced: true}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            }),
            imageminPngquant({
                speed: 1,
                quality: 50
            }),
            imageminMozjpeg({
                quality: 80
            }) 

        ], {
            verbose: true
        }
        
        ))
        .pipe(dest(`${buildDir}/assets/images`));
}

function revFiles() {
    const paths = [
        './app/temp/**/*',
        '!./app/temp/scripts/modernizr.js'
    ];
    return src(paths)
        .pipe(RevAll.revision({ dontRenameFile: ['.html'] }))
        .pipe(dest(`${buildDir}/assets`))
}

function injectFileNames() {
    return src('./app/index.html')
        .pipe(inject(src([`${buildDir}/assets/styles/**/*.css`], {read: false}), {ignorePath: '/docs', addRootSlash: false}))
        .pipe(inject(src(`${buildDir}/assets/scripts/vendors/*.js`, {read: false}), {name: 'head', ignorePath: '/docs', addRootSlash: false}))
        .pipe(inject(src([`${buildDir}/assets/scripts/*.js`, `!${buildDir}/assets/scripts/vendors/**/*.js`,`!${buildDir}/assets/scripts/vendors`], {read: false}), {ignorePath: '/docs', addRootSlash: false}))
        .pipe(dest(buildDir));
}

// Watch -------------------------------------------

function watch_files() {
    watch(styleWatch, series(styles, reload));
    watch(htmlWatch,  series(reload));
    watch(jsWatch,    series(modernizrTask, scripts, reload));
}

// Gulp Tasks -------------------------------------------

task("styles", styles);
task('scripts', scripts);

task('modernizrTask', modernizrTask);

task('deleteDistFolder', deleteDistFolder);
task('optimizeImages', optimizeImages);
task('revFiles', revFiles);
task('injectFileNames', injectFileNames);
task('copyGeneralFiles', copyGeneralFiles);

task("beginClean", beginClean);
task("createSprite", createSprite);
task("createPngCopy", createPngCopy);
task("copySpriteGraphic", copySpriteGraphic);
task("copySpriteCSS", copySpriteCSS);
task("endClean", endClean);

task("icons",
    series(
        beginClean,
        createSprite,
        createPngCopy,
        copySpriteGraphic,
        copySpriteCSS,
        endClean
    )
);

// -------------

task("default", parallel(
    browser_sync,
    watch_files
));

// -------------

task("build", series(
    deleteDistFolder,
    "icons",
    styles,
    modernizrTask,
    scripts,
    parallel(optimizeImages, copyGeneralFiles),
    revFiles,
    injectFileNames,
    function (done) {
        browserSync.init({
            notify: false,
            server: {
                baseDir: [buildDir]
            }
        });
        done();
    }
));



