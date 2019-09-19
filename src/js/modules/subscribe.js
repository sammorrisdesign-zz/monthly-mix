const bindings = () => {
    const inputEl = document.querySelector('.js-subscribe-input');
    const defaultCopy = inputEl.value;

    inputEl.addEventListener('focus', () => {
        if (inputEl.value === defaultCopy) {
            inputEl.value = '';
        }

        inputEl.classList.add('is-focused');
    });

    inputEl.addEventListener('blur', () => {
        if (inputEl.value === '') {
            inputEl.value = defaultCopy;
        }

        if (inputEl.value === defaultCopy) {
            inputEl.classList.remove('is-focused');
        }
    });
}

export default {
    init: () => {
        bindings();
    }
}