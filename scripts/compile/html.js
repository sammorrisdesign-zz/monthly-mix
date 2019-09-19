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
                playlist.archive = data;
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

        handlebars.registerHelper('count', function(string) {
            return string.length;
        })

        handlebars.registerHelper('charactersIn', function(string) {
            let characters = string.split('');
                characters = characters.map(character => { return `<span class='is-movable cover__letter'>${character}</span>`});
            return characters.join('');
        });

        handlebars.registerHelper('charactersInForArchive', function(string) {
            let characters = string.split('');
                characters = characters.map(character => { return `<span class='letter letter--${Math.floor(Math.random() * 10)}'>${character}</span>`});
            return characters.join('');
        });

        handlebars.registerHelper('handlise', function(string) {
            if (string) {
                return string.toLowerCase().replace(/ /g, '-');
            }
        });
    },

    registerPartials: function() {
        const partials = glob.readdirSync('src/templates/**/*.*');

        partials.forEach(function(partial) {
            let name = partial;
            if (partial.includes('partials')) {
                name = name.replace('src/templates/partials/', '').split('.')[0];
            } else {
                name = name.replace('src/templates/', '').split('.')[0];
            }
            const template = fs.readFileSync(partial, 'utf8');

            handlebars.registerPartial(name, template);
        });
        
    }
}