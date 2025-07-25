#!/usr/bin/env bash
# Exit on any error
set -o errexit

echo " Installing Python dependencies..."
pip install -r requirements.txt

echo " Running database migrations..."
# On Render, this will apply migrations to the linked PostgreSQL database.
# Locally, it will apply to the database configured in settings.py (DEV_DATABASE_URL or SQLite).
python manage.py migrate

echo " Collecting static files..."
python manage.py collectstatic --no-input

echo " Creating superuser if not exists..."
python manage.py shell <<EOF
import os
from django.contrib.auth import get_user_model

User = get_user_model()
username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

# Only attempt to create if all environment variables are set
if username and email and password:
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username, email, password)
        print(f'Superuser {username} created successfully.')
    else:
        print(f'Superuser {username} already exists.')
else:
    print('Skipping superuser creation: DJANGO_SUPERUSER_USERNAME, EMAIL, or PASSWORD environment variables not set.')
EOF

echo "Build process completed."