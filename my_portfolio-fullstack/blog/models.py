import requests
import json
from django.db import models
from django.utils import timezone
from django.urls import reverse

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    content = models.TextField(blank=True, null=True)
    gist_id = models.CharField(max_length=50, blank=True, null=True, help_text="Enter the ID of the GitHub Gist (e.g., 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6')")
    gist_content = models.TextField(blank=True, null=True)
    pub_date = models.DateTimeField(default=timezone.now)
    category = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        ordering = ['-' + 'pub_date']

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('blog_detail', kwargs={'slug': self.slug})

    def save(self, *args, **kwargs):
        if self.gist_id and not self.gist_content:
            try:
                gist_api_url = f"https://api.github.com/gists/{self.gist_id}"
                response = requests.get(gist_api_url)
                response.raise_for_status()  # Raise an exception for HTTP errors
                gist_data = response.json()
                
                # Gists can have multiple files, concatenate them or pick one
                content_parts = []
                for filename, file_data in gist_data['files'].items():
                    content_parts.append(f"### {filename}\n```\n{file_data['content']}\n```")
                self.gist_content = "\n\n".join(content_parts)

            except requests.exceptions.RequestException as e:
                print(f"Error fetching Gist {self.gist_id}: {e}")
                self.gist_content = f"Error fetching Gist: {e}"
            except json.JSONDecodeError:
                print(f"Error decoding JSON from Gist {self.gist_id}")
                self.gist_content = "Error decoding Gist content."
            except KeyError:
                print(f"Unexpected Gist data structure for {self.gist_id}")
                self.gist_content = "Unexpected Gist data structure."

        super().save(*args, **kwargs)
