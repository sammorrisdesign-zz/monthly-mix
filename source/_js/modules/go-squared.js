define([

], function(

) {
    return {
        init: function() {
            !function(g,s,q,r,d){r=g[r]=g[r]||function(){(r.q=r.q||[]).push(
            arguments)};d=s.createElement(q);q=s.getElementsByTagName(q)[0];
            d.src='//d1l6p2sc9645hc.cloudfront.net/tracker.js';q.parentNode.
            insertBefore(d,q)}(window,document,'script','_gs');
            
            _gs('GSN-411731-V');
        },

        newTrack: function(trackId, playlistTitle) {
            _gs('event', 'Played track ' + trackId + ' on playlist for ' + playlistTitle, {
              extra: 'event',
              details: true
            });
        }
    }
});