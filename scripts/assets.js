var fs = require('fs-extra');

module.exports = {
    html: function(data) {
        var handlebars = require('handlebars');
        var partialLoader = require('partials-loader');

        fs.removeSync('.build/' + data.handle + '.html');

        var html = fs.readFileSync('./src/templates/playlist.html', 'utf8');
        var template = handlebars.compile(html);

        partialLoader.handlebars({
            template_engine_reference: handlebars, 
            template_root_directories: './src/templates/',
            partials_directory_names: ['partials'],
            template_extensions: ['html']
        });

        fs.mkdirsSync('.build');
        fs.writeFileSync('.build/' + data.handle + '.html', template(data));
    },
} 