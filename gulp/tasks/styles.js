const gulp = require("gulp"),
    autoprefixer = require("autoprefixer"),
    postcss = require("gulp-postcss"),
    sass = require("gulp-sass"),
    nested = require("postcss-nested"),
    cssImport = require("postcss-import"),
    mixins = require("postcss-mixins"),
    responsiveType = require("postcss-responsive-type"),
    postcssCustomProperties = require("postcss-custom-properties"),
    simpleVars = require("postcss-simple-vars"),
    each = require("postcss-each"),
    functions = require("postcss-functions"),
    conditionals = require("postcss-conditionals"),
    zIndex = require("postcss-zindex");


gulp.task("styles", async () => {
    return gulp
        .src("./app/assets/styles/styles.css")
        .pipe(postcss([cssImport, mixins, each, functions, conditionals, simpleVars, postcssCustomProperties, zIndex, responsiveType, nested, autoprefixer]))
        .on("error", function (errorInfo) {
            console.log(errorInfo.toString());
            this.emit("end");
        })
        .pipe(gulp.dest("./app/temp/styles"));
});
