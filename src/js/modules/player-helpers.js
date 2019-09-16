export default {
    getCurrentId: () => {
        return document.querySelector('.controls__select option:checked').value;
    },

    getNextId: () => {
        const next = document.querySelector('.controls__select option:checked').nextElementSibling;

        if (next) {
            return next.value
        } else {
            return document.querySelector('.controls__select option').value;
        }
    },

    getPreviousId: () => {
        const previous = document.querySelector('.controls__select option:checked').previousElementSibling;

        if (previous) {
            return previous.value
        } else {
            return document.querySelector('.controls__select option:last-child').value;
        }
    }
}