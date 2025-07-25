#!/usr/bin/env bash
# exit on error
set -o errexit
set -x # Enable debugging output

pip install -r requirements.txt

python manage.py collectstatic --no-input

echo "Running migrations..."
python manage.py showmigrations # Show migration status before migrating
sleep 5 # Wait for 5 seconds, in case of database startup delays
python manage.py migrate --no-input # --no-input to prevent prompts
python manage.py showmigrations # Show migration status after migrating

# Create superuser non-interactively using environment variables
# IMPORTANT: Set DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_EMAIL, DJANGO_SUPERUSER_PASSWORD
# in Render environment variables, NOT hardcoded here.
python manage.py shell <<EOF
import os
from django.contrib.auth import get_user_model

User = get_user_model()
username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f'Superuser {username} created successfully.')
else:
    print(f'Superuser {username} already exists.')
EOF
