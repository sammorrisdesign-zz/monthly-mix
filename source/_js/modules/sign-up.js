define([
    'libs/bonzo',
    'libs/qwery'
], function(
    bonzo,
    qwery
) {

    var defaultValue = bonzo(qwery('.sign-up__input')).attr('value');

    return {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            for (i = 0; i < 2; i++) { 
                document.getElementsByClassName("sign-up__input")[i].onfocus = function (el) {
                    this.focusIn(el.srcElement);
                }.bind(this);
                document.getElementsByClassName("sign-up__input")[i].onblur = function (el) {
                    this.focusOut(el.srcElement);
                }.bind(this);
            }
        },

        focusIn: function(el) {
            bonzo(el).addClass('is-focused');
            if (bonzo(el).attr('value') === defaultValue) {
                bonzo(el).attr('value', '');
            }
        },

        focusOut: function(el) {
            bonzo(el).removeClass("is-focused");
            if (bonzo(el).attr('value') === '') {
                bonzo(el).attr('value', defaultValue);
            }
        }
    }
});