import youtube from './youtube';

let playerState = {
    isPlaying: false,
    currentId: null
}

const bindings = () => {
    let body = document.querySelector('body');

    body.addEventListener('ready', () => {
        const firstId = document.querySelector('.controls__track-list option:checked').value;
        playTrack(firstId);
        removeEventListener('ready', body);
    });

    body.addEventListener('ended', () => {
        
    });
}

const playTrack = id => {
    youtube.play(id);
    playerState.isPlaying = true;
    playerState.currentId = id;
}

const pauseTrack = () => {
    youtube.pause();
    playerState.isPlaying = false;
}

export default {
    init: () => {
        youtube.init();
        bindings();
    },

    togglePlayState: () => {
        if (playerState.isPlaying) {
            pauseTrack();
        } else {
            playTrack(playerState.currentId);
        }
    },

    playNewTrack: id => {
        playTrack(id);
    }
}