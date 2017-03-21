var watch = require('node-watch');
var static = require('node-static');
var assets = require('../scripts/assets.js');

watch('src', { recursive: true }, function(evt, name) {
    var fileExt = name.substring(name.lastIndexOf('.') + 1);

    console.log('watching');
    
    console.log(file);

    if (fileExt === 'html' || fileExt === 'svg') {
        console.log('test');
        assets.html();
    } else if (fileExt === 'scss') {
        // call assets.sass()
    } else if (fileExt === 'js') {
        assets.js()
    } else {
        console.log('non-watchable file extension changed :' + fileExt);
    }
});

var file = new static.Server('./.build', {
    'cache': 0,
    'headers': {
        'Access-Control-Allow-Origin': '*'
    }
});

console.log('serving embedded atom at http://localhost:' + 8000 + '/index.html')
console.log('serving the raw atom at http://localhost:' + 8000 + '/main.html');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(8000);