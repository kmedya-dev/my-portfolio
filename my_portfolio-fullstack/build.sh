#!/usr/bin/env bash
# exit on error
set -o errexit
set -x

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

echo "Attempting to create superuser..."
python manage.py createsuperuser --noinput
echo "Superuser creation command finished."