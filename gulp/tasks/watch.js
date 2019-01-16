let gulp         = require("gulp"),
    browserSync  = require("browser-sync").create(),
    reload       = browserSync.reload;

gulp.task("watch", () => {

    browserSync.init({
        notify: false,
        server: {
            baseDir: "./app" // or "app" - app folder
        }
    });

    gulp.watch("./app/assets/styles/**/*.css", gulp.series("styles"));
   // gulp.watch("./app/**/*.html").on('change', browserSync.reload);
    //gulp.watch("./app/**/*.css").on('change', browserSync.reload);
    gulp.watch(['./app/**/*.html', './app/**/*.css', './app/**/*.js'])
        .on('change', reload);


});
