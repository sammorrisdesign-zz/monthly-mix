// Required Modules
var handlebars = require("handlebars");
var fs = require("fs");

// External Files
require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

module.exports = {
    init: function () {
        return templates = {
            layout: {
                header: require("../../_template/layout/header.html"),
                footer: require("../../_template/layout/footer.html"),
            },
            pages: {
                index: require("../../_template/pages/index.html")
            }
        };
    }
}
