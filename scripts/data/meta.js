const corrections = require('./corrections.json');

module.exports = {
    getTrackInfo: function(data) {
        const trackInfo = this.cleanTrackMetaFromSnippet(data.snippet);
        const correction = corrections[data.snippet.resourceId.videoId];

        if (correction && correction.artist) {
            trackInfo.artist = correction.artist
        }

        if (correction && correction.title) {
            trackInfo.title = correction.title
        }

        console.log(trackInfo);

        return trackInfo;
    },

    cleanTrackMetaFromSnippet: function(snippet) {
        // Todo: get channel title if no division
        let phrasesToRemove = [
            'Official Video',
            'Official Audio',
            'Official Music Video',
            'Official',
            'Lyric Video',
            'Lyrics',
            'Demo',
            'Audio Only',
            'Audio'
        ];

        phrasesToRemove = phrasesToRemove.map(phrase => `\\(${phrase}\\)|\\[${phrase}\\]|${phrase}`)

        const regEx = new RegExp(phrasesToRemove.join('|'), 'gi');

        let title = snippet.title;
            title = title.replace(regEx, '').trim();
            title = title.split(/ - | – | \/\/ /);

        // Todo: Warn when meta data isn't two fields
        
        return {
            artist: title[0],
            title: title[1]
        }
    }
}