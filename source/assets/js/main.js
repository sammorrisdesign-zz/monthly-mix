requirejs.config({
    paths: {
        'sc': 'http://connect.soundcloud.com/sdk'
    }
});

require([
    'modules/fonts',
    'modules/soundcloud'
], function (
    fonts,
    soundcloud
) {
    fonts.init();
    soundcloud.init();
});