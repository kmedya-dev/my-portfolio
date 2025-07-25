# blog/admin.py
from django.contrib import admin
from .models import BlogPost

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'slug',
        'src', # Display the source URL
        'content_fetched_preview', # Display a preview of fetched content
        'pub_date',
        'category',
        'show_fetched_first'
    )
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'content_manual', 'src', 'content_fetched', 'credit')
    list_filter = ('category', 'pub_date', 'show_fetched_first')
    
    # Define the order of fields in the add/change form
    fields = (
        'title',
        'slug',
        'pub_date',
        'category',
        'src',                  # Source URL field
        'content_fetched',      # Fetched content field (read-only)
        'content_manual',       # Manual content field
        'show_fetched_first',   # Switch for content display priority
        'credit',               # Credit field
    )
    
    # Make fetched content fields read-only in the admin form
    readonly_fields = ('content_fetched',)
    
    list_per_page = 25 # Default pagination, adjust as needed

    def content_fetched_preview(self, obj):
        """
        Returns a truncated preview of the fetched content for the admin list display.
        """
        if obj.content_fetched:
            # Display first 150 chars, add ellipsis if longer
            return obj.content_fetched[:150] + '...' if len(obj.content_fetched) > 150 else obj.content_fetched
        return "-" # Display a dash if no content
    content_fetched_preview.short_description = "Fetched Content Preview" # Column header in admin list

    # The save_model method is called when saving an object in the admin.
    # We ensure the instance's save() method is called, which contains our fetching logic.
    def save_model(self, request, obj, form, change):
        # obj.save() will trigger the save method in BlogPost model
        # where the content_fetched fetching logic is implemented.
        obj.save()