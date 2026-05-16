from django.db import migrations
from django.utils.text import slugify

def populate_slugs(apps, schema_editor):
    Project = apps.get_model('projects', 'Project')
    from django.db.models import Q
    for project in Project.objects.filter(Q(slug__isnull=True) | Q(slug='')):
        base_slug = slugify(project.title) or 'project'
        slug = base_slug
        counter = 1
        while Project.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        project.slug = slug
        project.save()

class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0003_project_image_project_slug_project_technologies_and_more'),
    ]

    operations = [
        migrations.RunPython(populate_slugs),
    ]
