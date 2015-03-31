# A Liquid tag to generate classes for the playlist

module Jekyll
    class LayoutClasses < Liquid::Tag
        def render(context)
            @classes = "horizontal--#{rand(7 - 1)} vertical--#{rand(7 - 1)}"
            if rand(7 - 1) == 1
                @classes << " clear"
            end
            "#{@classes}"
        end
    end
end

Liquid::Template.register_tag('layoutclasses', Jekyll::LayoutClasses)
