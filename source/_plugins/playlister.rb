require 'soundcloud'
require 'json'

module Jekyll
    class Playlister < Liquid::Tag
        def initialize(tag_name, playlist, tokens)
            super
            # Register a client with Soundcloud
            file = File.read("../soundcloud-keys.json")
            data_hash = JSON.parse(file)
            client = SoundCloud.new(:client_id => data_hash['id'])
            @list = ""

            # Get Playlist and render it
            playlist = client.get('/resolve', :url => playlist)
            playlist.tracks.each do |track|
                @list << "<li class='track'>" +
                            "<img src='" + track.artwork_url + "' />" +
                            "<span class='track__artist'>" + (track.user.username || "") + "</span><br />" +
                            "<span class='track__title'>" + track.title + "</span><br />" + track.permalink_url + "<br />" +
                         "</li>"
            end
        end
    
        def render(context)
            "<ul class='playlist'>#{@list}</ul>" 
        end
    end
end

Liquid::Template.register_tag('playlist', Jekyll::Playlister)
