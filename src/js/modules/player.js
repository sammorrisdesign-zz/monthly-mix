let isPlaying = false;

const bindings = () => {
    let body = document.querySelector('body');

    body.addEventListener('ready', () => {
        removeEventListener('ready', body);

        const event = new Event('play');
        document.querySelector('body').dispatchEvent(event);
    });
}

const subscriptions = () => {
    mediator.subscribe('play', id => {
        isPlaying = true;
    });

    mediator.subscribe('pause', () => {
        isPlaying = false;
    })

    mediator.subscribe('toggle', () => {
        if (isPlaying) {
            mediator.publish('pause');
        } else {
            mediator.publish('play', document.querySelector('.controls__track-list option:checked').value);
        }
    })
}

export default {
    init: () => {
        bindings();
        subscriptions()
    }
}