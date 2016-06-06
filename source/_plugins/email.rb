module Jekyll
  class EmailPost < Page
    def initialize(site, base, dir, post)
      @site = site
      @base = base
      @dir = ''
      @name = dir + '/email.html'
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'email.html')

    end
  end

  class AmpGenerator < Generator
    priority :low
    def generate(site)
      site.posts.each do |post|
        index = EmailPost.new(site, site.source, post.id, post)
        index.render(site.layouts, site.site_payload)
        index.write(site.dest)
        site.pages << index
      end
    end
  end
end