from django.contrib import admin
from .models import BlogPost

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'gist_id', 'gist_content', 'pub_date', 'category')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'content', 'gist_id')
    list_filter = ('category', 'pub_date')
    fields = ('title', 'slug', 'gist_id', 'content', 'gist_content', 'category', 'pub_date')
    readonly_fields = ('gist_content',)