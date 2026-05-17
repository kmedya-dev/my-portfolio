from django.db import models
from django.urls import reverse
from django.utils.text import slugify

class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True, null=True)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    technologies = models.CharField(max_length=500, help_text="Comma-separated technologies", blank=True)
    link = models.URLField(blank=True, null=True, help_text="Live Demo Link")
    github_link = models.URLField(blank=True, null=True, help_text="GitHub Repository Link")
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('projects:project_detail', kwargs={'slug': self.slug})

    def get_tech_list(self):
        if self.technologies:
            return [tech.strip() for tech in self.technologies.split(',')]
        return []
