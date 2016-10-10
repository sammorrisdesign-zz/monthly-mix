var Player = (function () {
    var currentTrack,
        defaultTitle,
        playlistTitle,
        clientId = "5dcb5ea7cb935713b230330006d1765e",
        url = document.location.href.split("#")[0];

    var bindEvents = function() {
        $('.playlist__entry').click(function() {
            ifFirstPlay();
            playTrack($(this).attr('data-track-id'));
        });
        $('.audio-controls').click(function(el) {
            controlsPlay();
        });
        $('body').keyup(function(e){
           if(e.keyCode == 32){
                togglePlayOnSpaceBar(e);
           }
        });
    };

    var playTrack = function(trackId, scrollTo) {
        scrollTo = scrollTo || false;
        el = $('#track--' + trackId);
        player = $("audio").get(0).play();

        SC.get('/tracks/' + trackId).then(function(track) {
            var clip = new Phonograph.Clip({ url: track.stream_url + "?client_id=" + clientId });
            clip.buffer();
            clip.on('canplaythrough', function() {
                clip.play();
            });
        });

        if(scrollTo) {
            context.scrollToTrack(el);
        }
    };

    return {
        init: function() {
            SC.initialize({
                client_id: clientId
            });

            defaultTitle = document.title;
            // playlistTitle = $('.header__block .post-title').text();
            bindEvents();
            // ifHasId();
        }
    };
})();
