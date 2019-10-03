const fs = require('fs-extra');
const uglifycss = require('uglifycss');
const babelMinify = require('babel-minify');

const compressedCSS = uglifycss.processFiles(['./.build/assets/css/main.css']);
fs.writeFileSync('./.build/assets/css/main.css', compressedCSS);

const uncompressedJS = fs.readFileSync('./.build/assets/js/main.js').toString();
const compressedJS = babelMinify(uncompressedJS);
fs.writeFileSync('./.build/assets/js/main.js', compressedJS.code);
