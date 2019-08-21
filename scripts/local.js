const watch = require('node-watch');
const browserSync = require('browser-sync').create();
const browserSyncReuseTab = require('browser-sync-reuse-tab')(browserSync);
const html = require('./compile/html.js');
const css = require('./compile/css.js');
const assets = require('./compile/assets.js');
const javascript = require('./compile/javascript.js');

browserSync.init({
    server: './.build',
    port: 8000,
    open: false
}, browserSyncReuseTab);

browserSync.watch('./.build/**/*.css', (event, file) => {
    if (event === 'change') {
        browserSync.reload('*.css');
    }
});

console.log('watching');

watch('src', { recursive: true }, (event, file) => {
    const fileExt = file.substring(file.lastIndexOf('.') + 1);

    console.log(`A change has been made to ${file}`);

    switch(fileExt) {
        case 'html':
            html.init();
            break;

        case 'sass':
            css.init();
            break;

        case 'js':
            javascript.init();
            break;

        default:
            html.init();
            css.init();
            javascript.init();
            assets.init();
    }
})