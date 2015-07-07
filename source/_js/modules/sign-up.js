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
            document.getElementsByClassName("sign-up__input")[0].onfocus = function () {
                this.focusIn();
            }.bind(this);
            document.getElementsByClassName("sign-up__input")[0].onblur = function () {
                this.focusOut();
            }.bind(this);
        },

        focusIn: function() {
            bonzo(qwery('.sign-up__input')).addClass('is-focused');
            if (bonzo(qwery('.sign-up__input')).attr('value') === defaultValue) {
                bonzo(qwery('.sign-up__input')).attr('value', '');
            }
        },

        focusOut: function() {
            bonzo(qwery('.sign-up__input')).removeClass("is-focused");
            if (bonzo(qwery('.sign-up__input')).attr('value') === '') {
                bonzo(qwery('.sign-up__input')).attr('value', defaultValue);
            }
        }
    }
});