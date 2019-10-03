import helpers from './player-helpers';

let youTubePlayer,
    throttle = true,
    isInitialLoad = true,
    isPreview = true,
    isFirst = true,
    loadedTime;

const createYouTubeAPI = () => {
    const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
    document.querySelector('script').insertBefore(tag, null);

    window.onYouTubePlayerAPIReady = () => {
        createPlayer();
    }
}

const createPlayer = () => {
    youTubePlayer = new YT.Player('video-player', {
        height: '360',
        width: '640',
        playerVars: {
            'controls': 0,
            'modestbranding': 1,
            'playsinline': 1,
            'disablekb': 1,
            'iv_load_policy': 3
        },
        events: {
            'onReady': onReady,
            'onStateChange': onStateChange,
            'onError': onError
        }
    });
}

const onReady = () => {
    youTubePlayer.mute();
    youTubePlayer.setVolume(0);
    youTubePlayer.loadVideoById({videoId: helpers.getCurrentId()});
}

const onStateChange = event => {
    if (event.data === 0) {
        // throttled because YT fires 'ended' event twice
        if (throttle) {
            if (isPreview) {
                loadedTime = new Date();
                youTubePlayer.seekTo(0);
            } else {
                mediator.publish('play', helpers.getNextId());
            }

            throttle = false;

            setTimeout(function() {
                throttle = true;
            }, 100);
        }
    }

    if (event.data === 1 && isInitialLoad) {
        mediator.publish('ready');
        loadedTime = new Date();
        isInitialLoad = false;
    }

    if (event.data === 1) {
        updateProgress();
    }
}

const onError = () => {
    // This should maybe flag something to the listener?
    mediator.publish('play', helpers.getNextId());
}

const updateProgress = () => {
    if (youTubePlayer.getPlayerState() === 1) {
        const currentTime = youTubePlayer.getCurrentTime();
        const duration = youTubePlayer.getDuration();
        const percentage = currentTime / duration * 100;
        document.querySelector('.controls__progression').setAttribute('style', 'width: ' + percentage + '%;');

        setTimeout(updateProgress, 100);
    }
}

const subscriptions = () => {
    mediator.subscribe('play', id => {
        isPreview = false;
        const playingId = youTubePlayer.getVideoData().video_id;

        if (playingId === id) {
            youTubePlayer.playVideo();
        } else {
            youTubePlayer.loadVideoById({videoId: id});
        }

        if (isFirst) {
            // restart video if page loaded ages ago
            const timeSinceLoad = new Date() - loadedTime;
            if (timeSinceLoad > 10000) {
                youTubePlayer.seekTo(0);
            }

            // fade volume in for first play
            let volume = 0;
            const increaseVol = () => {
                volume = volume + 5;
                youTubePlayer.setVolume(volume);

                if (volume !== 100) {
                    setTimeout(increaseVol, 100);
                }
            }

            youTubePlayer.unMute();
            increaseVol();

            isFirst = false;
        }
    });

    mediator.subscribe('pause', () => {
        youTubePlayer.pauseVideo();
    })
}

export default {
    init: () => {
        createYouTubeAPI();
        subscriptions();
    }
}