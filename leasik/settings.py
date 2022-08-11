"""
Django settings for leasik project.

Generated by 'django-admin startproject' using Django 4.0.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""

from os import getenv
from sys import stderr, exit
from pathlib import Path

from dotenv import load_dotenv
import dj_database_url

# Graphene uses force_text which is not available in this version of Django.
# See: https://stackoverflow.com/questions/70382084/import-error-force-text-from-django-utils-encoding
import django
from django.utils.encoding import force_str

django.utils.encoding.force_text = force_str


load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

debug_mode = False if getenv("DJANGO_DEBUG_MODE") is None else True
debug_secret_key = "tkukh(3t!l!nc4s*a8tq)tc3i34dkn%=0s)m!7*l+xmm#4t0%@"

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = debug_secret_key if debug_mode else getenv("DJANGO_SECRET_KEY")
if SECRET_KEY is None:
    print("django: no secret key set", file=stderr)
    exit(1)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = debug_mode

DATA_UPLOAD_MAX_NUMBER_FIELDS = None

allowed_hosts_env_val = getenv("DJANGO_ALLOWED_HOST")
if allowed_hosts_env_val is None and not debug_mode:
    print("django: no allowed hosts provided", file=stderr)
    exit(1)

ALLOWED_HOSTS = [] if debug_mode else allowed_hosts_env_val.split()


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # "django.contrib.sites",
    "leasikApp",
    "corsheaders",
    "graphene_django",
]

MIDDLEWARE = [
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    # "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "leasik.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "leasik.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

database_url = (
    "sqlite:///db.sqlite" if debug_mode else getenv("DJANGO_DATABASE_URL")
)
engine = None if debug_mode else "django_cockroachdb"

if database_url is None:
    print("django: a valid database URL has not been provided", file=stderr)
    exit(1)

DATABASES = {"default": dj_database_url.parse(database_url, engine)}

DISABLE_COCKROACHDB_TELEMETRY = True


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

AUTHENTICATION_BACKENDS = [
    "graphql_jwt.backends.JSONWebTokenBackend",
    "django.contrib.auth.backends.ModelBackend",
]

# if site_id := getenv("DJANGO_SITE_ID") is None:
#     raise KeyError("DJANGO_SITE_ID not set.")

# SITE_ID = int(site_id)

# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_ROOT = BASE_DIR / "staticfiles"
STATIC_URL = "/static/"

STATICFILES_DIRS = [BASE_DIR / "static"]


# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CSRF_COOKIE_SECURE = True
# SESSION_COOKIE_SECURE = True

# cors_allowed_origins_env_val = getenv("DJANGO_CORS_ALLOWED_ORIGIN")
# if cors_allowed_origins_env_val is None and not debug_mode:
#     print("django: no allowed CORS origins provided", file=stderr)
#     exit(1)

# CORS_ALLOWED_ORIGINS = (
#     [] if debug_mode else cors_allowed_origins_env_val.split()
# )
# CORS_ORIGIN_ALLOW_ALL = debug_mode
CORS_ORIGIN_ALLOW_ALL = True


GRAPHENE = {
    "SCHEMA": "leasik.schema.schema",
    "MIDDLEWARE": ["graphql_jwt.middleware.JSONWebTokenMiddleware"],
}
