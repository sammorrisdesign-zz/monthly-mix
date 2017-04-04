var player = require('./modules/player.js');
var navigation = require('./modules/navigation.js');
var subscribe = require('./modules/subscribe.js');
var analytics = require('./modules/analytics.js');

player.init();
analytics.init();
navigation.init();
subscribe.init();
