var YouTube = require('youtube-node');

module.exports = {
    fetch: function() {
        fs.mkdirsSync('.data');
        fs.writeFileSync('.data/index.html', '{}');
    },
} 