"use strict";

// Load Gulp...of course
const { src, dest, task, watch, series, parallel } = require("gulp"),

        browserSync = require("browser-sync").create(),
        webpack = require('webpack-stream'),
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
        rename                    = require("gulp-rename"),
        plumber                   = require( 'gulp-plumber' ),
        del                       = require("del"),

        // Project related variables
        styleSRC            = './app/assets/styles/styles.css',
        styleURL            = './app/temp/styles',

        htmlSRC             = './app/assets/pug/main.pug',
        htmlURL             = './app/temp/',

        jsAppSRC            = './app/assets/scripts/App.js',
        jsVendorSRC         = './app/assets/scripts/Vendor.js',
        jsURL               = './app/temp/scripts/',
        //jsBundleName      = 'App.bundle.js',
        //jsFiles           = [ jsURL, jsVendor ],

        styleWatch          = './app/assets/styles/**/*.css',
        htmlWatch           = './app/**/*.html',
        jsWatch             = './app/assets/scripts/**/*.js',

        // Gulp SVG Sprite Config
        config = {
            mode: {
                css: {
                    sprite: "sprite.svg",
                    render: {
                        css: {
                            template: "./gulp/templates/sprite.css"
                        }
                    }
                }
            }
        };

// Tasks
function browser_sync(done) {
	browserSync.init({
        notify: false,
		server: {
			baseDir: ["./", "./app"]
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

// Styles Task
function styles() {
    return src(styleSRC)
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
                autoprefixer
            ])
        )

        .on("error", function (errorInfo) {
            console.log(errorInfo.toString());
            this.emit("end");
        })

        .pipe(dest( styleURL ));
}

// Scripts Task
function scripts() {
    return src( jsAppSRC )
        .pipe(webpack(
            {
                // Gulp configuration
                entry: {
                    App: jsAppSRC,
                    Vendor: jsVendorSRC 
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

        .on("error", function(err, stats, callback) {
            if (err) {
                console.log(err.toString());
                this.emit("end");
              }

              console.log(stats.toString());
              callback();
        })
        
        .pipe(dest(jsURL));
}

// HTML Task
function html() {
	return triggerPlumber( htmlSRC, htmlURL );
}

// Spirtes Task
function beginClean() {
    return del(['./app/temp/sprite', './app/assets/images/sprites']);
}

function createSprite() {
    return src('./app/assets/images/icons/**/*.svg')
        .pipe(svgSprite(config))
        .pipe(dest('./app/temp/sprite/'));
}

function copySpriteGraphic() {
    return src('./app/temp/sprite/css/**/*.svg')
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

function watch_files() {
    watch(styleWatch, series(styles, reload));
    watch(htmlWatch,  series(reload));
    watch(jsWatch,  series(scripts, reload));
}


task("styles", styles);
task('scripts', scripts);

task("beginClean", beginClean);
task("createSprite", createSprite);
task("copySpriteGraphic", copySpriteGraphic);
task("copySpriteCSS", copySpriteCSS);
task("endClean", endClean);
task("icons",
    series(
        beginClean,
        createSprite,
        copySpriteGraphic,
        copySpriteCSS,
        endClean
    )
);

task("default", parallel(browser_sync, watch_files));


