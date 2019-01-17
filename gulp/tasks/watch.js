// Load Gulp...of course
const { task, watch, series, parallel } = require("gulp"),
        browserSync = require("browser-sync").create(),

        // Project related variables
        styleWatch = './app/assets/styles/**/*.css',
        htmlWatch = './app/**/*.html';

// Tasks
function browser_sync(done) {
	browserSync.init({
		server: {
			baseDir: './dist/'
		}
	});
	
	done();
}

function reload(done) {
    browserSync.reload();
    done();
}

function watch_files() {
    watch(styleWatch, series(styles, reload));
    watch(htmlWatch,  series(html,   reload));
}

task("watch", parallel(browser_sync, watch_files));


