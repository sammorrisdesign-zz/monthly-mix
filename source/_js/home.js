define([
    'modules/canvas',
    'modules/sign-up'
], function(
    Canvas,
    SignUp
) {
    function init() {
        Canvas.init();
        SignUp.init();
    }

    return {
        init: init
    };
});