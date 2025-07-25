
from blog.models import BlogPost
import json

posts_data = []
for post in BlogPost.objects.all():
    posts_data.append({
        'title': post.title,
        'slug': post.slug,
    })

print(json.dumps(posts_data, indent=2))
