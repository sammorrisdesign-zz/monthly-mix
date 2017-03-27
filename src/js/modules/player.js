var $ = require('../vendor/jquery.js');
var youtube = require('../modules/youtube.js');

module.exports =  {
    init: function() {
        youtube.init();
        this.bindings();
    },

    bindings: function() {
        $('.track').click(function(el) {
            this.play(el.currentTarget);
        }.bind(this));

        $('body').on('ready', function() {
            this.play($('.track')[0]);
        }.bind(this));
    },

    play: function(track) {
        console.log(track);
        youtube.play($(track).attr('data-id'));
    }
};