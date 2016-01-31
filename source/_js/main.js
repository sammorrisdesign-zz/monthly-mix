requirejs.config({
    paths: {
        'sc': 'https://connect.soundcloud.com/sdk/sdk-3.0.0'
    }
});

require([
    'modules/go-squared'
], function (
    goSquared
) {
    goSquared.init();

    var bootstrap = document.body.getAttribute('data-bootstrap');

    if (bootstrap === "home") {
        require(['home'], function(Home) {
            Home.init();
        });
    } else if (bootstrap == "playlist") {
        require(['playlist'], function(Playlist) {
            Playlist.init();
        });
    }
});