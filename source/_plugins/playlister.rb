require 'soundcloud'
require 'json'
require 'open-uri'
require 'rmagick'

module Jekyll
  class Playlister < Generator
    def generate(site)
        site.posts.each do |post|
            if (post.data['soundcloud'] && post.data['fetch'] === true)
                render_playlist(post.data['soundcloud'])
            end
        end
    end

    def render_playlist(url)
        # Register a client with Soundcloud
        file = File.read("soundcloud-keys.json")
        data_hash = JSON.parse(file)
        client = SoundCloud.new(:client_id => data_hash['id'])
        @list = Array.new

        # Get Playlist and render json
        playlist = client.get('/resolve', :url => url)
        playlist.tracks.each_with_index do |track, index|
            image_grabber(track.artwork_url, track.id.to_s)
            title_splitter(track.title, track.user.username)
            @list << {
                :id     => track.id.to_s,
                :artwork => @img_dest,
                :color => common_color(@img_dest),
                :contrast => contrast_color(@color),
                :title  => @title,
                :artist => @username,
                :permalink => track.permalink_url
            }
        end

        File.write("_data/" + url.split("/")[-1] + ".json", JSON.pretty_generate(@list))
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

    def title_splitter(title, username)
        if title.include? " - "
            # Format titles if on a record label account (and remove quotation marks)
            @title = title.split(" - ")[1].gsub /["']/, ''
            @username = title.split(" - ")[0]
        elsif title.include? " // "
            # For Capture Tracks tracks
            @title = title.split(" // ")[1]
            @username = title.split(" // ")[0]
        else
            @title = title
            @username = username
        end
    end

    def common_color(src)
        # Open image and find most frequently appearing colo(u)rs
        img = Magick::Image.read(src).first
        q = img.quantize(3, Magick::RGBColorspace)
        palette = q.color_histogram.sort {|a, b| b[1] <=> a[1]}
        palette = palette[0][0]

        # Convert to RGB
        color = { :r => 0.0, :g => 0.0, :b => 0.0 }
        color[:r] += palette.red
        color[:g] += palette.green
        color[:b] += palette.blue
        color.each_key do |c|
            color[c] = (color[c] / Magick::QuantumRange * 255).to_i
            if color[c] < 30
                color[c] = 30
            end
        end

        @color = "rgb(#{color[:r]},#{color[:g]},#{color[:b]})"
        return @color
    end

    def contrast_color(rgb)
        rgb = rgb.gsub /[rgb()]/, ''
        r = rgb.split(',')[0].to_i
        g = rgb.split(',')[1].to_i
        b = rgb.split(',')[2].to_i
        yiq = ((r*299)+(g*587)+(b*114)) / 1000

        if yiq >= 170
            return 'is-light'
        elsif yiq <= 40
            return 'is-very-dark'
        else
            return 'is-dark'
        end
    end
  end
end