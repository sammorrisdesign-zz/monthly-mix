const fs = require('fs-extra');
const sass = require('node-sass');

module.exports = {
    init: function() {
        fs.mkdirsSync('.build/assets/css');

        const css = sass.renderSync({
            file: 'src/sass/main.scss'
        }).css.toString('utf8');
        
        fs.writeFileSync('.build/assets/css/main.css', css);
    }
}
