const html = require('./compile/html.js');
const css = require('./compile/css.js');
const javascript = require('./compile/javascript.js');
const assets = require('./compile/assets.js');

console.log('compiling all assets');

html.init();
css.init();
javascript.init();
assets.init();
