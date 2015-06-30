define([
    'modules/soundcloud'
], function(
    Soundcloud
) {
    function init() {
        Soundcloud.init();
    }

    return {
        init: init
    };
});