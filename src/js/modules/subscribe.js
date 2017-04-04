var $ = require('../vendor/jquery.js');

var $input = $('.subscribe-form__input'),
    defaultValue = $input.val();

module.exports =  {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $input.focusin(function() {
            this.focusIn();
        }.bind(this));
        $input.focusout(function() {
            this.focusOut();
        }.bind(this));
    },

    focusIn: function() {
        $input.addClass('is-focused');

        if ($input.val() === defaultValue) {
            $input.val('');
        }
    },

    focusOut: function() {
        if ($input.val() === '') {
            $input.removeClass('is-focused');
            $input.val(defaultValue);
        }
    }
};
