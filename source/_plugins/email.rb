# module Jekyll
#     class EmailPage < Page
#         def initialize(site, base, dir, post, content)
#             @site = site
#             @base = base
#             @dir = dir
#             @name = 'email.html'
# 
#             self.process(@name)
#             self.data = post
#             puts content
#             self.data['content'] = content
#             puts self.data['content']
#             self.data['layout'] = 'email'
#         end
#     end
# 
#     class Email < Generator
#         safe true
#         def generate(site)
#             site.posts.each do |post|
#                 puts post
#                 site.pages << EmailPage.new(site, site.source, post.url, post.data, post)
#             end
#         end
#     end
# end