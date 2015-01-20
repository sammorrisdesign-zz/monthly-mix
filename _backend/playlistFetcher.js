// Required Modules
var request = require('request');
var handlebars = require("handlebars");
var fs = require("fs");
var layout = require("./helpers/templates.js");

console.log(layout.init());

// External Files
require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
