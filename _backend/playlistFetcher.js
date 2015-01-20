// Required Modules
var request = require('request');
var handlebars = require("handlebars");
var fs = require("fs");

// Local Modules
var templates = require("./helpers/templates.js");

// External Files
require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

console.log(templates.fetch().layout.header);

