module Jekyll
    class EmailPost < Page
        def initialize(site, base, dir, post)
            require 'kramdown'
            @site = site
            @base = base
            @dir = dir
            @name = 'email.html'
            self.process(@name)
            self.read_yaml(File.join(base, '_layouts'), 'email.html')
            self.data['body'] = Kramdown::Document.new(post.content).to_html
            self.data['canonical_url'] = post.url
        end
    end

    class AmpGenerator < Generator
        priority :low
        def generate(site)
            site.posts.docs.each do |post|
                index = EmailPost.new(site, site.source, post.id, post)
                index.render(site.layouts, site.site_payload)
                index.write(site.dest)
                site.pages << index
            end
        end
    end
end