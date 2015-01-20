// Required Modules
var handlebars = require("handlebars");
var fs = require("fs");

module.exports = {
    build: function(pageTemplate, variables) {
        var template = handlebars.compile(this.fetch().pages[pageTemplate]);
        this.write(this.fetch().layout.header + template(variables) + this.fetch().layout.footer);
    },

    fetch: function() {
        this.requireSetup();

        return templates = {
            layout: {
                header: require("../../_template/layout/header.html"),
                footer: require("../../_template/layout/footer.html"),
            },
            pages: {
                index: require("../../_template/pages/index.html")
            }
        };
    },

    requireSetup: function() {
        require.extensions['.html'] = function (module, filename) {
            module.exports = fs.readFileSync(filename, 'utf8');
        };
    },

    write: function(input) {
        fs.writeFile("../index.html", input, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("File Written");
            }
        });
    }
}
