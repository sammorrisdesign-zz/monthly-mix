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
    },

    play: function(track) {
        youtube.play($(track).attr('data-id'));
    }
};