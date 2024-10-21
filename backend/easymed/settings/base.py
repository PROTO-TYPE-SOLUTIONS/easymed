
from pathlib import Path
from datetime import timedelta
from decouple import config
import os
from dotenv import load_dotenv
import dj_database_url


load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
# This is where the sqlite database will be
PROJECT_DIR = Path(__file__).resolve().parent.parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

DEBUG = True

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    #third party apps
    'rest_framework',
    'drf_spectacular',
    'rest_framework_simplejwt',
    'weasyprint',
    'channels',

    # user apps
    'authperms.apps.AuthpermsConfig',
    'customuser.apps.CustomuserConfig',
    'patient.apps.PatientConfig',
    'pharmacy.apps.PharmacyConfig',
    'inventory.apps.InventoryConfig',
    'laboratory.apps.LaboratoryConfig',
    'receptions.apps.ReceptionsConfig',
    'billing.apps.BillingConfig',
    'announcement.apps.AnnouncementConfig',
    'company',
    'reports'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'easymed.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'easymed.wsgi.application'
ASGI_APPLICATION = 'easymed.asgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Africa/Nairobi'

USE_I18N = True

USE_TZ = True



STATIC_URL = '/static/'
MEDIA_URL = '/images/'

STATICFILES_DIRS = [
    BASE_DIR / 'static',
    BASE_DIR / 'frontend/build/static' #Unnecessary if you just need Backend Setup for Image Upload. It's just to Load React Project Static Files
]

MEDIA_ROOT = BASE_DIR / 'static/images'
STATIC_ROOT = BASE_DIR / 'staticfiles'


STATICFILES_FINDERS = (
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
)


# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


REST_FRAMEWORK = {
    # "DEFAULT_PERMISSION_CLASSES": [
    #     "rest_framework.permissions.IsAuthenticated",
    #     ],

    "DEFAULT_AUTHENTICATION_CLASSES": [  
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SESSION_COOKIE_AGE = 30000
AUTH_USER_MODEL = 'customuser.CustomUser'


SPECTACULAR_SETTINGS = {
    "TITLE": "Make-Easy HMIS",
    "DESCRIPTION": "Make-Easy HMIS Endpoints",
    "VERSION": "1.0.0",
}


SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=36000),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
    'SLIDING_TOKEN_LIFETIME': timedelta(days=1),
    'SLIDING_TOKEN_REFRESH_LIFETIME_GRACE_PERIOD': timedelta(days=2),
    'SLIDING_TOKEN_REFRESH_SCOPE': None,
    'SLIDING_TOKEN_TYPES': {'access': 'a', 'refresh': 'r'},
    'TOKEN_OBTAIN_SERIALIZER': 'customuser.serializers.CustomTokenObtainPairSerializer',
}

# emails
EMAIL_BACKEND =config("EMAIL_BACKEND", cast=str)
EMAIL_HOST = config("EMAIL_HOST", cast=str)
EMAIL_PORT = config("EMAIL_PORT", cast=int)
EMAIL_USE_TLS = True
EMAIL_HOST_USER = config("EMAIL_HOST_USER", cast=str)
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", cast=str)


REDIS_PORT=os.getenv("REDIS_PORT")
REDIS_HOST=os.getenv("REDIS_HOST")
# Celery Configuration
CELERY_BROKER_URL = f'redis://redis:6379/0'
print("wacuka")

CELERY_RESULT_BACKEND = CELERY_BROKER_URL


CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TASK_SERIALIZER = 'json'
CELERY_TIMEZONE = 'Africa/Nairobi'
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': CELERY_BROKER_URL,# Adjust the Redis location as needed
        'TIMEOUT': 108001,
        'KEY_PREFIX': 'user:',

        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}




CHANNELS_ROUTING = 'patient.routing.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [(os.getenv('REDIS_HOST'), int(os.getenv('REDIS_PORT')))],
        },
    },
}

''''
For some reason, docker is not able to differentiate db configs 
'''
DATABASE_URL = os.getenv("DATABASE_URL")
print(DATABASE_URL)
DATABASES = {
    "default": dj_database_url.config(default=DATABASE_URL, conn_max_age=1800),
}

''' You need to have the environemnt variables defined in your .env
'''
# DATABASES = {
#     "default":{
#         "ENGINE": config("DB_ENGINE"),
#         "NAME": config("POSTGRES_DB"),
#         "USER": config("POSTGRES_USER"),
#         "PASSWORD": config("POSTGRES_PASSWORD"),
#         "HOST": config("POSTGRES_HOST"),
#         "PORT": config("POSTGRES_PORT"),
#     }
# }