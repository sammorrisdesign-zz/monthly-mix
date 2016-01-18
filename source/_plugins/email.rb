module Jekyll
    class EmailPage < Page
        def initialize(site, base, dir, post)
            @site = site
            @base = base
            @dir = dir
            @name = 'email.html'

            self.process(@name)
            self.data = post
            self.data['layout'] = 'email'
        end
    end

    class Email < Generator
        safe true
        def generate(site)
            site.posts.each do |post|
                site.pages << EmailPage.new(site, site.source, post.url, post.data)
            end
        end
    end
end