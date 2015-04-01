# A Liquid tag to generate classes for the playlist

module Jekyll
    class TotalDuration < Liquid::Tag
        def look_up(context, name)
          lookup = context

          name.split(".").each do |value|
            lookup = lookup[value]
          end

          lookup
        end

        def initialize(tag_name, input, tokens)
            super
            @input = input
        end

        def render(context)
            output = super 
            if @input  =~ /([\w]+(\.[\w]+)*)/i
                @duration = look_up(context, $1)
                @duration += 0.0
            end

            @duration = @duration / 1000
            @duration = Time.at(@duration).strftime('%kh %Mm')
            "#{@duration}"
        end
    end
end

Liquid::Template.register_tag('totalduration', Jekyll::TotalDuration)
