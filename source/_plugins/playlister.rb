require 'soundcloud'
require 'json'
require 'open-uri'
require 'rmagick'

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
                @list << "<li class='track' id='" + track.id.to_s + "' style='background-color:" + common_color(@img_dest) + ";'>" +
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
            if File.exist?(@img_dest) == false
                open(@img_dest, 'wb') do |file|
                    file << open(url).read
                end
            end
        end

        def common_color(src)
            img = Magick::Image.read(src).first
            q = img.quantize(3, Magick::RGBColorspace)
            palette = q.color_histogram.sort {|a, b| b[1] <=> a[1]}
            palette = palette[0][0]

            color = { :r => 0.0, :g => 0.0, :b => 0.0 }
            color[:r] += palette.red
            color[:g] += palette.green
            color[:b] += palette.blue
            color.each_key do |c|
                color[c] = (color[c] / Magick::QuantumRange * 255).to_i
            end

            return "rgb(#{color[:r]},#{color[:g]},#{color[:b]})"
        end

        def render(context)
            "<ul class='playlist'>#{@list}</ul>" 
        end
    end
end

Liquid::Template.register_tag('playlist', Jekyll::Playlister)
