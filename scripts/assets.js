var fs = require('fs-extra');

module.exports = {
    html: function(data) {
        if (data) {
            this.compileHtmlPage(data) 
        } else {
            var klawSync = require('klaw-sync');
            var dataPaths = klawSync('.data', {ignore: '.DS_Store'});

            for (var i in dataPaths) {
                var jsonData = JSON.parse(fs.readFileSync(dataPaths[i].path, 'utf8'));
                this.compileHtmlPage(jsonData);
            }
        }
    },

    compileHtmlPage: function(data) {
        var handlebars = require('handlebars');
        var partialLoader = require('partials-loader');

        fs.removeSync('.build/' + data.handle + '.html');

        var html = fs.readFileSync('./src/templates/main.html', 'utf8');
        var template = handlebars.compile(html);

        partialLoader.handlebars({
            template_engine_reference: handlebars, 
            template_root_directories: './src/templates/',
            partials_directory_names: ['partials'],
            template_extensions: ['html']
        });

        fs.mkdirsSync('.build');
        fs.writeFileSync('.build/' + data.handle + '.html', template(data));
        console.log('updated html for ' + data.handle);
    },

    js: function() {
        var browserify = require('browserify');
        var stringify = require('stringify');
        var deasync = require('deasync');

        var isDone = false;

        fs.removeSync('.build/assets/js/main.js');
        fs.mkdirsSync('.build/assets/js');

        browserify('./src/js/main.js').transform(stringify, {
            appliesTo: { includeExtensions: ['.hjs', '.html', '.whatever'] }
        }).bundle(function(err, buf) {
            if (err) {
                console.log(err);
            }
            fs.writeFileSync('.build/assets/js/main.js', buf.toString());
            isDone = true;
            console.log('updated js!');
        });

        deasync.loopWhile(function() {
            return !isDone;
        });
    },

    css: function() {
        var sass = require('node-sass');

        fs.removeSync('.build/assets/css/main.css');
        fs.mkdirsSync('.build/assets/css');

        var css = sass.renderSync({
            file: 'src/sass/main.scss'
        }).css.toString('utf8');

        fs.writeFileSync('.build/assets/css/main.css', css);
        console.log('updated css!');
    }
} 