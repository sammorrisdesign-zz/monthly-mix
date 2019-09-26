const fs = require('fs-extra');

module.exports = {
    init: () => {
        fs.copySync('./src/images', '.build/assets/images');
    }
}
