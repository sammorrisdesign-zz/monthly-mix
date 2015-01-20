// Required Modules
var handlebars = require("handlebars");
var fs = require("fs");

module.exports = {
    fetch: function () {
        require.extensions['.html'] = function (module, filename) {
            module.exports = fs.readFileSync(filename, 'utf8');
        };

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
