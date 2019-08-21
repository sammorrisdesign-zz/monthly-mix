export default {
    getCurrentId: () => {
        return document.querySelector('.controls__track-list option:checked').value;
    },

    getNextId: () => {
        const next = document.querySelector('.controls__track-list option:checked').nextElementSibling;

        if (next) {
            return next.value
        } else {
            return document.querySelector('.controls__track-list option').value;
        }
    },

    getPreviousId: () => {
        const previous = document.querySelector('.controls__track-list option:checked').previousElementSibling;

        if (previous) {
            return previous.value
        } else {
            return document.querySelector('.controls__track-list option:last-child').value;
        }
    }
}