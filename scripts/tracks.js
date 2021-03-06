var fs = require('fs-extra');
var keys = require('../keys.json');
var youtube = require('youtube-api');
var corrections = JSON.parse(fs.readFileSync('./scripts/corrections.json', 'utf8'));

var debug = true;

module.exports = {
    fetch: function(playlist) {
        this.getTracks(playlist.id, function(data) {
            var playlistTracks = this.cleanData(playlist, data);
            var jsonFileLocation = '.data/' + playlistTracks.handle + '.json';
            var oldData = fs.existsSync(jsonFileLocation) ? JSON.parse(fs.readFileSync(jsonFileLocation, 'utf8')) : {tracks: '', colour: ''};

            if (JSON.stringify(oldData.tracks) !== JSON.stringify(playlistTracks.tracks) || debug) {
                playlistTracks.colour = oldData.colour == '' ? this.generateColour() : oldData.colour;
                playlistTracks.colourAsHex = this.colourToHex(playlistTracks.colour),
                fs.mkdirsSync('.data');
                fs.writeFileSync(jsonFileLocation, JSON.stringify(playlistTracks));
            }
        }.bind(this));
    },

    getTracksInfo: function(playlistId, callStackSize, pageToken, currentItems, callBack) {
        youtube.playlistItems.list({
            part: 'snippet',
            pageToken: pageToken,
            maxResults: 50,
            playlistId: playlistId
        }, function(err, data) {
            if (err) {
                callback({error: err});
                return
            };

            for (var x in data.items) {
                currentItems.push(data.items[x].snippet);
            }

            if (data.nextPageToken) {
                this.getTracksInfo(playlistId, callStackSize + 1, data.nextPageToken, currentItems, callBack)
            } else {
                callBack(currentItems);
            }
        }.bind(this));
    },

    getTracks: function(id, done) {
        youtube.authenticate({
            type: 'key',
            key: keys.youtube
        });

        this.getTracksInfo(id, 0, null, [], done)
    },

    cleanData: function(playlistInfo, data) {
        var playlist = {};

        for (var i in data) {
            if (data[i].title !== "Deleted video") {
                var correction = corrections[data[i].resourceId.videoId] || {};
                playlist[i] = {
                    id: data[i].resourceId.videoId,
                    artist: correction.hasOwnProperty('artist') ? correction.artist : this.cleanTrackInfo(data[i].title).artist,
                    title: correction.hasOwnProperty('title') ? correction.title : this.cleanTrackInfo(data[i].title).title
                }
            }
        }

        return {
            lastModified: Date.now(),
            title: playlistInfo.title,
            handle: playlistInfo.title.replace(' ', '-').toLowerCase(),
            month: playlistInfo.title.split(' ')[0].toLowerCase(),
            year: playlistInfo.title.split(' ')[1],
            id: playlistInfo.id,
            description: playlistInfo.description.split('Monthly Mix: ')[0],
            spotify: playlistInfo.description.split('Spotify: ')[1],
            tracks: playlist
        };
    },

    cleanTrackInfo: function(videoTitle) {
        videoTitle = videoTitle.replace(/\(Official Video\)|\(Official Audio\)|\(official music video\)|\(Official Music Video\)|\(Official\)|\(Lyrics\)|\(audio only\)|\[OFFICIAL MUSIC VIDEO\]|\[LYRIC VIDEO\]|\[Official Audio\]|\[OFFICIAL VIDEO\]|\[OFFICIAL\]|\[OFFICIAL AUDIO\]|/g, '');
        videoTitle = videoTitle.split(/ - | – | \/\/ /);

        return {
            artist: videoTitle[0],
            title: videoTitle[1] ? videoTitle[1].replace(/"/g, '').replace(/'/g, '') : ''
        }
    },

    generateColour: function() {
        var colours = ['orange', 'green', 'yellow', 'purple', 'blue', 'pink', 'mint', 'red', 'hot-pink', 'lime'];
        return colours[Math.floor(Math.random()*colours.length)];
    },

    colourToHex: function(colour) {
        var colours = {
            'orange': '#e6711b',
            'green': '#19e479',
            'yellow': '#e6d22e',
            'purple': '#4c20c9',
            'blue': '#009cf5',
            'pink': '#e4a4bb',
            'mint': '#66e0c8',
            'red': '#d8192b',
            'hot-pink': '#e6256c',
            'lime': '#80ce1b'
        }

        return colours[colour];
    }
} 