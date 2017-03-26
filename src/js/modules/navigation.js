var $ = require('../vendor/jquery.js');

module.exports =  {
    init: function() {
        console.log('navigation');
        this.bindings();
    },

    bindings: function() {
        $('.playlist__button').click(function() {
            console.log('click');
            this.hidePlaylist();
        }.bind(this));
    },

    hidePlaylist: function() {
        
        $('.playlist').toggleClass('is-closed');
    }
};