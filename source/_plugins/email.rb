module Jekyll
  class EmailPost < Page
    def initialize(site, base, dir, post)
      @site = site
      @base = base
      @dir = ''
      @name = dir + '/email.html'
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'email.html')
      self.data['body']          = post.content
      self.data['title']         = post.data['title']
      self.data['date']          = post.data['date']
      self.data['author']        = post.data['author']
      self.data['category']      = post.data['category']
      self.data['canonical_url'] = post.url
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