var $ = require('../vendor/jquery.js');

module.exports = {
    init: function() {
        !function(g,s,q,r,d){r=g[r]=g[r]||function(){(r.q=r.q||[]).push(
        arguments)};d=s.createElement(q);q=s.getElementsByTagName(q)[0];
        d.src='//d1l6p2sc9645hc.cloudfront.net/tracker.js';q.parentNode.
        insertBefore(d,q)}(window,document,'script','_gs');
        _gs('GSN-411731-V');

        this.bindings();
    },

    bindings: function() {
        $('playlist-header__link--spotify').click(function() {
            this.click('spotify')
        }.bind(this));

        $('playlist-header__link--youtube').click(function() {
            this.click('youtube')
        }.bind(this));

        $('playlist__youtube-button').click(function() {
            this.click('watch on youtube')
        }.bind(this));
    },

    newTrack: function(track, playlist) {
        _gs('event', 'Played ' + track + ' on ' + playlist, {
          extra: 'event',
          details: true
        });
    },

    click: function(buttonTitle) {
        _gs('event', 'clicked on ' + buttonTitle, {
          extra: 'event',
          details: true
        });
    }
}
