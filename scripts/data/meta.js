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

        return trackInfo;
    },

    cleanTrackMetaFromSnippet: function(snippet) {
        let title = snippet.title;
            title = this.removeFrequentPhrases(title);
            title = this.splitTitle(title);

        if (title.length == 1) {
            if (title[0].includes("\"")) {
                title = this.getTitleFromQuotes(title);
            } else {
                console.log(title);
            }
        }

        // Todo: check if two fields, if not look at channel title and use that as artist name

        if (title.length !== 2) {
            // WARN and print id
        }

        return {
            artist: title[0],
            title: title[1]
        }
    },

    removeFrequentPhrases: function(title) {
        let phrasesToRemove = [
            'Official Lyric Video',
            'Official Music Video',
            'Official Video',
            'Official Audio',
            'Official',
            'Single',
            'Visualiser',
            'Visualizer',
            'Lyric Video',
            'Lyrics',
            'Demo',
            'Audio Only',
            'Audio'
        ];

        phrasesToRemove = phrasesToRemove.map(phrase => `\\(${phrase}\\)|\\[${phrase}\\]|${phrase}`)

        const regEx = new RegExp(phrasesToRemove.join('|'), 'gi');

        return title.replace(regEx, '').trim();
    },

    splitTitle: function(title) {
        return title.split(/ - | – | ~ | \/\/ | \/\/\/ /);
    },

    getTitleFromQuotes: function(title) {
        const quotedTitle = title[0].match(/"((?:\\.|[^"\\])*)"/);
 
        if (quotedTitle && quotedTitle.index > 0) {
            return [title[0].replace(quotedTitle[0], '').trim(), quotedTitle[1]]
        } else {
            return title
        }
    }
}