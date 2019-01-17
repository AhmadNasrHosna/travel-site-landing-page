// Load Gulp...of course
const { src, dest, task, series } = require("gulp"),

        svgSprite = require("gulp-svg-sprite"),
        rename = require("gulp-rename"),
        del = require("del");


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