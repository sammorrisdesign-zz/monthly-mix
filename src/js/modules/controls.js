import player from './player.js';

const bindings = () => {
    document.querySelector('.js-play').addEventListener('click', () => {
        player.togglePlayState();
    })
}

export default {
    init: () => {
        bindings();
    }
}