# blog/models.py
import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urlparse
from django.db import models
from django.utils import timezone
from django.urls import reverse
from django.template.defaultfilters import slugify

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200, blank=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    src = models.URLField(
        blank=True,
        null=True,
        verbose_name="Source URL",
        help_text="Paste a public URL (GitHub Gist, YouTube, news article, etc.) to fetch content."
    )
    content_manual = models.TextField(
        blank=True,
        null=True,
        verbose_name="Manual Content",
        help_text="Manually written content for the blog post."
    )
    content_fetched = models.TextField(
        blank=True,
        null=True,
        verbose_name="Fetched Content",
        help_text="Content automatically fetched from the Source URL. This field is read-only."
    )
    pub_date = models.DateTimeField(default=timezone.now)
    credit = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Credit/Attribution",
        help_text="Optional: Credit the original source (e.g., author name, link)."
    )
    show_fetched_first = models.BooleanField(
        default=False,
        verbose_name="Show Fetched Content First",
        help_text="Check to display fetched content before manual content on detail page."
    )

    _original_src = None # Internal variable to store the original src value for change detection

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._original_src = self.src

    def save(self, *args, **kwargs):
        # Auto-generate slug if not provided
        if not self.slug:
            self.slug = slugify(self.title)
            # Ensure slug is unique
            original_slug = self.slug
            queryset = BlogPost.objects.all().exclude(pk=self.pk)
            count = 1
            while queryset.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{count}"
                count += 1

        # Fetch content if src is provided and has changed
        if self.src and self.src != self._original_src:
            parsed_url = urlparse(self.src)

            # 1. Detect GitHub Gist URL
            if "gist.github.com" in parsed_url.netloc:
                match = re.search(r'gist\.github\.com/([^/]+)/([a-f0-9]+)', self.src)
                if match:
                    gist_username = match.group(1)
                    gist_id = match.group(2)
                    self.content_fetched = f'<script src="https://gist.github.com/{gist_username}/{gist_id}.js"></script>'
                else:
                    self.content_fetched = "Error: Could not extract Gist ID from URL. Please check the Gist URL format."
            # 2. Detect YouTube URL
            elif "youtube.com" in parsed_url.netloc or "youtu.be" in parsed_url.netloc:
                video_id_match = re.search(r'(?:v=|/embed/|.be/)([a-zA-Z0-9_-]{11})', self.src)
                if video_id_match:
                    video_id = video_id_match.group(1)
                    self.content_fetched = f'<iframe width="100%" height="315" src="https://www.youtube.com/embed/{video_id}" frameborder="0" allowfullscreen></iframe>'
                else:
                    self.content_fetched = "Error: Could not extract YouTube video ID from URL. Please check the YouTube URL format."
            # 3. For other public URLs, fetch and extract readable text
            else:
                try:
                    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
                    response = requests.get(self.src, timeout=15, headers=headers)
                    response.raise_for_status()

                    soup = BeautifulSoup(response.text, 'html.parser')
                    for script_or_style in soup(["script", "style"]):
                        script_or_style.extract()
                    text_content = soup.get_text(separator='\n', strip=True)
                    text_content = re.sub(r'\n\s*\n', '\n\n', text_content)
                    self.content_fetched = text_content[:5000] # Truncate to 5000 characters
                    if len(text_content) > 5000:
                        self.content_fetched += "\n\n[... Content truncated ...]"

                except requests.exceptions.RequestException as e:
                    self.content_fetched = f"Error fetching content from {self.src}: {e}"
                except Exception as e:
                    self.content_fetched = f"Error processing content from {self.src}: {e}"
        elif not self.src and self._original_src:
            # If src was cleared, clear content_fetched as well
            self.content_fetched = None

        super().save(*args, **kwargs)
        self._original_src = self.src # Update original_src after saving

    class Meta:
        ordering = ['-pub_date']
        verbose_name = "Blog Post"
        verbose_name_plural = "Blog Posts"

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('blog_detail', kwargs={'slug': self.slug})
