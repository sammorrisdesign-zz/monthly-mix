const keys = require('../../config.json');
const youtube = require('youtube-api');

module.exports = {
    getTrackInfo: function(snippet) {
        let title = snippet.title;
            title = this.removeFrequentPhrases(title);
            title = this.splitTitle(title);
            title = this.dropQuotes(title);
            title = title.filter(Boolean);

        if (title.length == 1) {
            if (title[0].includes("\"")) {
                title = this.getTitleFromQuotes(title);
            } else {
                title = this.getTitleFromVideoId(title, snippet.resourceId.videoId);
            }
        }

        title = title.filter(Boolean);

        if (title.length < 2) {
            console.log('Missing meta for ', snippet.resourceId.videoId, ' – currently title reads as ', title);
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
        return title.split(/ - | – | – | — | ~ | \/\/ | \/\/\/ /);
    },

    dropQuotes: function(title) {
        let trackTitle = title[1];
        if (trackTitle) {
            if (trackTitle[0] == "“" && trackTitle[trackTitle.length - 1] == "“") {
                trackTitle = trackTitle.replace(/“/g, '');
            }

            if (trackTitle[0] == "\"" && trackTitle[trackTitle.length - 1] == "\"") {
                trackTitle = trackTitle.replace(/\"/g, '');
            }
        }

        title[1] = trackTitle;

        return title;
    },

    getTitleFromQuotes: function(title) {
        const quotedTitle = title[0].match(/"((?:\\.|[^"\\])*)"/);
 
        if (quotedTitle && quotedTitle.index > 0) {
            return [
                title[0].replace(quotedTitle[0], '').trim(),
                quotedTitle[1]
            ]
        } else {
            return title
        }
    },

    getTitleFromVideoId: function(title, videoId) {
        let isFetching = true;

        youtube.authenticate({
            type: 'key',
            key: keys.youtube
        });

        youtube.videos.list({
            part: 'snippet',
            id: videoId
        }, function(err, data) {
            if (err) {
                throw err;
            }

            if (data.items.length) {
                title = [
                    data.items[0].snippet.channelTitle.replace(' - Topic', ''),
                    this.removeFrequentPhrases(data.items[0].snippet.title)
                ]
            }

            isFetching = false;
        }.bind(this));

        require('deasync').loopWhile(function() { return isFetching });

        return title;
    }
}