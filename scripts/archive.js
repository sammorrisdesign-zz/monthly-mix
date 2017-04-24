var fs = require('fs-extra');
var klawSync = require('klaw-sync');

module.exports = {
    compile: function() {
        fs.removeSync('.data/archive.json');
        fs.mkdirsSync('.data');

        var playlists = klawSync('.data');

        var archive = [];

        for (var i in playlists) {
            var playlist = fs.readJsonSync(playlists[i].path);
            archive[i] = {
                url: 'http://www.monthly.mx/' + playlist.year + '/' + playlist.month,
                handle: playlist.handle,
                colour: playlist.colour,
                month: playlist.month,
                year: playlist.year,
                timeStamp: Date.parse(playlist.month + ' ' + playlist.year),
                path: '.data/' + playlist.month + '-' + playlist.year + '.json'
            }
        }

        archive.sort(function(a, b) {
            return b.timeStamp - a.timeStamp;
        });

        var lastYear = null;

        for (var i in archive) {
            if (lastYear !== archive[i].year) {
                archive[i].isFirstInYear = true;
            }

            if (i == archive.length - 1 || archive[i].year !== archive[parseInt(i) + 1].year) {
                archive[i].isLastInYear = true;
            }
            lastYear = archive[i].year;
        }

        fs.writeFileSync('.data/archive.json', JSON.stringify(archive));

        return archive
    }
} 