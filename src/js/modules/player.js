import youtube from './youtube';

let playerState = {
    isPlaying: false,
    currentId: null
}

const bindings = () => {
    let body = document.querySelector('body');

    body.addEventListener('ready', () => {
        const firstId = document.querySelector('.controls__track-list option').value;
        playTrack(firstId);
        removeEventListener('ready', body);
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
    }
}