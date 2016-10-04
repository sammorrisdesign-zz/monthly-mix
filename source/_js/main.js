// = require ./libs/jquery.js
// = require_tree ./modules

GoSquared.init();
SignUp.init();

var bootstrap = $('body').attr('data-bootstrap');

if (bootstrap === 'playlist') {
    Soundcloud.init();
}
