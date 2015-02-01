require 'soundcloud'
require 'json'
require 'open-uri'

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
                image_grabber(track.artwork_url, track.id.to_s)
                @list << "<li class='track' id='" + track.id.to_s + "'>" +
                            "<img src='/" + @img_dest + "' />" +
                            "<span class='track__artist'>" + (track.user.username || "") + "</span><br />" +
                            "<span class='track__title'>" + track.title + "</span><br />" + track.permalink_url + "<br />" +
                         "</li>"
            end
        end

        def image_grabber(url, id)
            # Get a larger size of image
            # See: https://developers.soundcloud.com/docs/api/reference#artwork_url for a list of sizes
            url ["large"] = "t300x300"
            @img_dest = "assets/images/artwork/" + id + ".jpg"

            # Check if image has already been downloaded before copying to assets folder
            if File.exist?(@img_dest)
                puts "We already have " + id
            else
                puts "GETTING" + id
                open(@img_dest, 'wb') do |file|
                    file << open(url).read
                end
            end
        end

        def render(context)
            "<ul class='playlist'>#{@list}</ul>" 
        end
    end
end

Liquid::Template.register_tag('playlist', Jekyll::Playlister)
