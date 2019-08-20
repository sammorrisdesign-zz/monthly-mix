import player from './player.js';

const bindings = () => {
    document.querySelector('.js-play').addEventListener('click', () => {
        player.togglePlayState();
    });

    document.querySelector('.js-track-list').addEventListener('change', () => {
        updateTrackLabels();
        player.playNewTrack(document.querySelector('.controls__track-list option:checked').value);
    });
}

const updateTrackLabels = () => {
    const data = document.querySelector('.controls__track-list option:checked').dataset;
    document.querySelector('.controls__track-artist').innerHTML = data.artist;
    document.querySelector('.controls__track-title').innerHTML = data.title;
}

export default {
    init: () => {
        bindings();
        updateTrackLabels();
    },

    updateTrackLabels: () => {
        updateTrackLabels();
    }
}