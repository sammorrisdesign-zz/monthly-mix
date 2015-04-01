# A Liquid tag to generate classes for the playlist

module Jekyll
    class SvgInline < Liquid::Tag
        def initialize(tag_name, path, tokens)
            super
            @path = path
        end

        def render(context)
            "#{File.read('assets/images/' + @path.strip + '.svg')}"
        end
    end
end

Liquid::Template.register_tag('svg', Jekyll::SvgInline)
