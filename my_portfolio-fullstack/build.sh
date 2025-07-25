#!/usr/bin/env bash
# Exit on error
set -o errexit

echo " Installing requirements..."
pip install -r requirements.txt

echo " Collecting static files..."
python manage.py collectstatic --no-input

echo "⚙️ Making and applying migrations..."
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete
python manage.py makemigrations
python manage.py migrate

echo " Creating superuser if not exists..."
python manage.py shell <<EOF
import os
from django.contrib.auth import get_user_model
User = get_user_model()
username = os.environ['DJANGO_SUPERUSER_USERNAME']
email = os.environ['DJANGO_SUPERUSER_EMAIL']
password = os.environ['DJANGO_SUPERUSER_PASSWORD']
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f'Superuser {username} created.')
else:
    print(f'Superuser {username} already exists.')
EOF
