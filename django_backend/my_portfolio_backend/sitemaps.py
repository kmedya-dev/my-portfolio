from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from homepage.models import WelcomeMessage # Assuming homepage has a single entry
from projects.models import Project
from blog.models import BlogPost
from courses.models import Course

class StaticViewSitemap(Sitemap):
    priority = 0.8
    changefreq = 'daily'

    def items(self):
        return ['home', 'project_list', 'blog_list', 'course_list']

    def location(self, item):
        return reverse(item)

class ProjectSitemap(Sitemap):
    priority = 0.6
    changefreq = 'weekly'

    def items(self):
        return Project.objects.all()

    def lastmod(self, obj):
        # Assuming projects don't have a last modified field, you can add one if needed
        return None

class BlogPostSitemap(Sitemap):
    priority = 0.7
    changefreq = 'daily'

    def items(self):
        return BlogPost.objects.all()

    def lastmod(self, obj):
        return obj.pub_date

class CourseSitemap(Sitemap):
    priority = 0.5
    changefreq = 'monthly'

    def items(self):
        return Course.objects.all()

    def lastmod(self, obj):
        # Assuming courses don't have a last modified field, you can add one if needed
        return None
