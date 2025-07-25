# my_portfolio_backend/settings.py

from pathlib import Path
import os
import dj_database_url
from dotenv import load_dotenv # Import load_dotenv

# Load environment variables from .env file in local development
# This line should be at the very top of your settings.py
# It will only load if .env exists, and won't override existing system env vars (like on Render)
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# Use an environment variable for SECRET_KEY, with a fallback for local dev
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-4za!f+#@krq!n+!z2xw9+*v3j$-t+*7b@o3ekm+udh^*toonlc')

# SECURITY WARNING: don't run with debug turned on in production!
# Use an environment variable for DEBUG. Render will set this to 'False' in production.
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '.onrender.com', # Allows all Render subdomains
]
# Add your specific Render domain if needed, e.g., 'kmedya.onrender.com'
if os.environ.get('RENDER_EXTERNAL_HOSTNAME'):
    ALLOWED_HOSTS.append(os.environ['RENDER_EXTERNAL_HOSTNAME'])


# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sitemaps',
    'homepage',
    'projects',
    'blog',
    'courses',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # For serving static files in production
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'my_portfolio_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'my_portfolio_backend' / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'my_portfolio_backend.wsgi.application'


# Database configuration
# Render automatically sets DATABASE_URL for internal connections.
# For local development, we'll use DEV_DATABASE_URL from .env or fall back to SQLite.
if os.environ.get('DATABASE_URL'):
    # Production on Render (internal URL)
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DATABASE_URL'),
            conn_max_age=600,
            ssl_require=True, # Always require SSL for production PostgreSQL
        )
    }
elif os.environ.get('DEV_DATABASE_URL'):
    # Local development with external PostgreSQL
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DEV_DATABASE_URL'),
            conn_max_age=600,
            ssl_require=True, # Render's external URLs typically require SSL
        )
    }
else:
    # Local development fallback to SQLite (if no DATABASE_URL or DEV_DATABASE_URL is set)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATICFILES_DIRS = [
]

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'