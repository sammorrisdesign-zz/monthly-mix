define([
    'libs/bean',
    'libs/bonzo',
    'libs/qwery'
], function(
    bean,
    bonzo,
    qwery
) {

    var defaultValue = bonzo(qwery('.sign-up__input')).attr('value');

    return {
            this.bindEvents();
        },

        bindEvents: function() {
            bean.on(document.body, 'focusin', '.sign-up__input', function(e) {
                this.focusIn();
            }.bind(this));
            bean.on(document.body, 'focusout', '.sign-up__input', function(e) {
                this.focusOut();
            }.bind(this));
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