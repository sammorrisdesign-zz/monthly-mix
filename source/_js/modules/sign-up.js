var SignUp = (function () {
    var $input = $('.sign-up__input');
    var defaultValue = $input.val();

    var bindEvents = function() {
        $input.focusin(function() {
            focusIn();
        });
        $input.focusout(function() {
            focusOut();
        });
    };

    var focusIn = function() {
        $input.addClass('is-focused');
        if($input.val() === defaultValue) {
            $input.val('');
        }
    };

    var focusOut = function() {
        if ($input.val() === '') {
            $input.removeClass('is-focused');
            $input.val(defaultValue);
        }
    };

    return {
        init: function() {
            bindEvents();
        }
    };
})();
