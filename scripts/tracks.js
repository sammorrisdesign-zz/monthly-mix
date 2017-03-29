var fs = require('fs-extra');
var keys = require('../keys.json');
var youtube = require('youtube-api');
var assets = require('../scripts/assets.js');
var corrections = JSON.parse(fs.readFileSync('./scripts/corrections.json', 'utf8'));

var debug = true;

module.exports = {
    fetch: function(playlist, isIndex) {
        this.getTracks(playlist.id, function(data) {
            var playlistTracks = this.cleanData(playlist, data);
            var jsonFileLocation = '.data/' + playlistTracks.handle + '.json';
            var oldData = fs.existsSync(jsonFileLocation) ? JSON.parse(fs.readFileSync(jsonFileLocation, 'utf8')) : {tracks: '', colour: ''};

            if (JSON.stringify(oldData.tracks) !== JSON.stringify(playlistTracks.tracks) || debug) {
                playlistTracks.colour = oldData.colour == '' ? this.generateColour() : oldData.colour;
                playlistTracks.isIndex = isIndex;
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
                this.getPlaylistInfo(playlistId, callStackSize + 1, data.nextPageToken, currentItems, callBack)
            } else {
                callBack(currentItems);
            }
        });
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
            var correction = corrections[data[i].resourceId.videoId] || {};
            playlist[i] = {
                id: data[i].resourceId.videoId,
                artist: correction.hasOwnProperty('artist') ? correction.artist : this.cleanTrackInfo(data[i].title).artist,
                title: correction.hasOwnProperty('title') ? correction.title : this.cleanTrackInfo(data[i].title).title
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
        videoTitle = videoTitle.replace(/\(Official Video\)|\(Official Audio\)|\(official music video\)|\(audio only\)/g, '');
        videoTitle = videoTitle.split(/ - | – | \/\/ /);

        return {
            artist: videoTitle[0],
            title: videoTitle[1] ? videoTitle[1].replace(/"/g, '').replace(/'/g, '') : ''
        }
    },

    generateColour: function() {
        var colours = ['light-blue', 'purple', 'mid-grey', 'blue', 'green', 'yellow', 'orange', 'purple-grey'];
        return colours[Math.floor(Math.random()*colours.length)];
    }
} 