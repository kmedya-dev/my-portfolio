import requests
from django.core.management.base import BaseCommand
from projects.models import Project
import os

class Command(BaseCommand):
    help = 'Fetch public repositories from GitHub and save them as projects'

    def handle(self, *args, **options):
        username = os.environ.get('GITHUB_USERNAME', 'kmedya-dev')
        url = f'https://api.github.com/users/{username}/repos'
        
        self.stdout.write(f'Fetching projects for user: {username}...')
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            repos = response.json()
            
            count = 0
            for repo in repos:
                # Skip forks if you only want your original work
                if repo.get('fork'):
                    continue
                
                title = repo.get('name')
                description = repo.get('description') or 'No description provided.'
                github_link = repo.get('html_url')
                # Use homepage if available, otherwise use github_link
                link = repo.get('homepage') or github_link
                
                # Update if exists, otherwise create
                project, created = Project.objects.update_or_create(
                    github_link=github_link,
                    defaults={
                        'title': title,
                        'description': description,
                        'link': link,
                    }
                )
                
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created project: {title}'))
                    count += 1
                else:
                    self.stdout.write(f'Updated project: {title}')
            
            self.stdout.write(self.style.SUCCESS(f'Successfully synced {count} new projects.'))
            
        except requests.exceptions.RequestException as e:
            self.stdout.write(self.style.ERROR(f'Error fetching from GitHub: {e}'))
