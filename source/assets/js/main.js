requirejs.config({
    paths: {
        'sc': 'http://connect.soundcloud.com/sdk'
    }
});

require([
    'libs/bonzo',
    'libs/qwery',
    'modules/fonts',
    'modules/soundcloud'
], function (
    bonzo,
    qwery,
    fonts,
    soundcloud
) {
    fonts.init();
    soundcloud.init();
});