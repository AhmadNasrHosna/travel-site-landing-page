// Load Gulp...of course
const { src, dest, task, watch, series, parallel } = require("gulp"),

        browserSync = require("browser-sync").create(),

        // css
        autoprefixer            = require("autoprefixer"),
        postcss                 = require("gulp-postcss"),
        sass                    = require("gulp-sass"),
        nested                  = require("postcss-nested"),
        cssImport               = require("postcss-import"),
        mixins                  = require("postcss-mixins"),
        responsiveType          = require("postcss-responsive-type"),
        postcssCustomProperties = require("postcss-custom-properties"),
        simpleVars              = require("postcss-simple-vars"),
        each                    = require("postcss-each"),
        functions               = require("postcss-functions"),
        conditionals            = require("postcss-conditionals"),
        zIndex                  = require("postcss-zindex"),

        svgSprite               = require("gulp-svg-sprite"),
        rename                  = require("gulp-rename"),
        plumber                 = require( 'gulp-plumber' ),
        del                     = require("del"),

        // Project related variables
        styleWatch = './app/assets/styles/**/*.css',
        htmlWatch = './app/**/*.html';
        
        styleSRC = './app/assets/styles/styles.css',
        styleURL = './app/temp/styles',
        mapURL = './',

        htmlSRC     = './dist/**/*.html';
        htmlURL     = './dist/';


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
        port: 8080,
        notify: false,
		server: {
			baseDir: './app/'
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

        .pipe(dest(styleURL));
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
    //  watch(htmlWatch,  series(html, reload));
}


task("styles", styles);
task("html", html);

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

task("watch", parallel(browser_sync, watch_files));


