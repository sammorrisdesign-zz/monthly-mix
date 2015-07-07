define([
    'modules/canvas',
    'modules/sign-up',
    'modules/header-scrolling'
], function(
    Canvas,
    SignUp,
    HeaderScrolling
) {
    function init() {
        Canvas.init();
        SignUp.init();
        HeaderScrolling.init();
    }

    return {
        init: init
    };
});