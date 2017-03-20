var isDeploy = process.argv.slice(2)[0] == 'true' ? true : false;
var assets = require('../scripts/assets.js');

assets.html();