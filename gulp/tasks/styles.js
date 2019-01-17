// Load Gulp...of course
const { src, dest, task } = require("gulp"),

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

        // Project related variables
        styleSRC = '"./app/assets/styles/styles.css"',
        styleURL = './app/temp/styles',
        mapURL = './';

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

task("styles", styles);
