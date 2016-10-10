// = require_tree ./libs
// = require_tree ./modules

GoSquared.init();
SignUp.init();

var bootstrap = $('body').attr('data-bootstrap');

if (bootstrap === 'playlist') {
    Player.init();
}
