const fs = require('fs-extra');
const glob = require('glob-fs')({ gitignore: true });
const handlebars = require('handlebars');
const data = require('../../data.json');

module.exports = {
    init: function() {
        const html = fs.readFileSync('./src/templates/main.html', 'utf8');
        const template = handlebars.compile(html);

        this.registerHelpers()
        this.registerPartials();

        Object.keys(data).forEach((key, i) => {
            const playlist = data[key];
            const location = `.build/${playlist.year}/${playlist.month.toLowerCase()}`;
            fs.mkdirsSync(location);
            fs.writeFileSync(location + '/index.html', template(playlist));

            if (i === 0) {
                fs.writeFileSync('.build/index.html', template(playlist));
            }
        });

        fs.mkdirsSync('.build/')
    },

    registerHelpers: function() {
        handlebars.registerHelper('inc', function(value) {
            return parseInt(value) + 1;
        });
    },

    registerPartials: function() {
        const partials = glob.readdirSync('src/templates/**/*.*');

        partials.forEach(function(partial) {
            const name = partial.replace('src/templates/partials/', '').split('.')[0];
            const template = fs.readFileSync(partial, 'utf8');

            handlebars.registerPartial(name, template);
        });
    }
}