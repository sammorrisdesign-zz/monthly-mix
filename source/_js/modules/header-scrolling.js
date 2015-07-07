define([
    'libs/qwery',
    'libs/bonzo',
    'libs/bean',
    'utils/scroller'
], function(
    qwery,
    bonzo,
    bean,
    scroller
) {

    return {
        init: function() {
            this.bindings();
        },

        bindings: function() {
            bean.on(document.body, 'click', '.navigation__item a', function(e) {
                e.preventDefault();
                var offset = bonzo(qwery(e.target.hash)).offset().top;
                scroller.scrollTo(offset, 500, 'easeInQuad');
            });
        }
    }
});