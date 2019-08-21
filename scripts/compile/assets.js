const fs = require('fs-extra');

module.exports = {
    init: () => {
        fs.removeSync('.build/assets/images');
        fs.copySync('./src/images', '.build/assets/images')
    }
}
