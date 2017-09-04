var fs = require('fs-extra');

module.exports = {
    html: function(data) {
        for (var i in data) {
            var jsonData = JSON.parse(fs.readFileSync(data[i].path, 'utf8'));
            jsonData.archive = data;
            this.compileHtmlPage(jsonData, i);
            this.compileEmail(jsonData);
        }
    },

    compileHtmlPage: function(data, i) {
        var handlebars = require('handlebars');
        var partialLoader = require('partials-loader');

        var html = fs.readFileSync('./src/templates/main.html', 'utf8');
        var template = handlebars.compile(html);

        partialLoader.handlebars({
            template_engine_reference: handlebars, 
            template_root_directories: './src/templates/',
            partials_directory_names: ['partials'],
            template_extensions: ['html']
        });

        handlebars.registerHelper('randomButton', function() {
            var randomNumber = Math.floor(Math.random() * 6) - 3;
            return randomNumber == 0 ? -3 : randomNumber;
        })

        handlebars.registerHelper('limit', function (arr, limit) {
            var smallArr = {};
            for (var i in arr) {
                if (i == limit) {
                    return smallArr;
                } else {
                    smallArr[i] = arr[i];
                }
            }
        });

        handlebars.registerHelper("len", function(json) {
            return Object.keys(json).length;
        });

        handlebars.registerHelper("inc", function(value, options) {
            return parseInt(value) + 1;
        });

        var location = '.build/' + data.year + '/' + data.month + '/';

        fs.mkdirsSync(location);
        fs.writeFileSync(location + 'index.html', template(data));
        if (i == 0) {
            fs.writeFileSync('.build/index.html', template(data));
        }
        console.log('updated html for ' + data.handle);
    },

    compileEmail: function(data) {
        var handlebars = require('handlebars');
        var partialLoader = require('partials-loader');

        var html = fs.readFileSync('./src/templates/email.html', 'utf8');
        var template = handlebars.compile(html);

        var location = '.build/' + data.year + '/' + data.month + '/';

        data.description = '<p>Hey Monthly Mixers</p>' + data.description + '<p>Happy New Month, <br />Sam Morris</p>';
        data.description = data.description.replace(/<p>/g, '<p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span id="docs-internal-guid-08af3be0-0244-464c-d6e8-dc24afaa97e5"><span style="color:rgb(0, 0, 0); font-family:\'Adelle Sans\', sans-serif; font-size:14.6667px; vertical-align:baseline; white-space:pre-wrap">') .replace(/<\/p>/g, '</span></span></p> \r\n &nbsp; \r\n');
        data.description = data.description.replace(/Monthly Mix for ([^\s]+) [0-9]{4}/g, '<a href="http://www.monthly.mx/{{ year }}/{{ month }}" style="color: {{ colourAsHex }}; text-decoration:underline" target="_blank">$&</a>');

        var newTemplate = handlebars.compile(template(data));

        fs.mkdirsSync(location);
        fs.writeFileSync(location + 'email.html', newTemplate(data));
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
    },

    images: function() {
        fs.removeSync('.build/assets/images');
        fs.copySync('./src/images', '.build/assets/images');
    }
} 