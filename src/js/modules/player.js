import youtube from './youtube';

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
}

export default {
    init: () => {
        youtube.init();
        bindings();
    }
}