define([
    'libs/bonzo',
    'libs/bean',
    'libs/qwery'
], function(
    bonzo,
    bean,
    qwery
) {
    return {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            bean.on(window, 'scroll', function(e) {
                var scrollPosition = qwery('body')[0].scrollTop;
                this.animateShapes(scrollPosition);
                this.animateTitle(scrollPosition);
                this.animateNav(scrollPosition);
            }.bind(this));
        },

        animateShapes: function(pos) {
            var $shapes = bonzo(qwery('.home-shapes')),
                height = $shapes[0].offsetHeight,
                disappearAt = height / 2;

            $shapes.attr('style',
                'transform: translateY(-' + pos / 3 + 'px);' +
                'opacity:' + (pos - disappearAt) / (-height) * 2 + ';'
            );
        },

        animateTitle: function(pos) {
            var $title = bonzo(qwery('.home-header .container')),
                height = $title[0].offsetHeight,
                disappearAt = height * 1.5;

            $title.attr('style',
                'transform: translateY(-' + pos / 2 + 'px);' +
                'opacity:' + (pos - disappearAt) / (-height) * 2 + ';'
            );
        },

        animateNav: function(pos) {
            var $nav = bonzo(qwery('.header--home'));
            
            $nav.attr('style', 'background-color: rgba(255, 255, 255, ' + (pos - 200) / 300 * 2 + ')');
        }
    }
});