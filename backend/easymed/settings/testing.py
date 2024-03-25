import logging

from .base import *

logging.disable(logging.ERROR)

DEBUG = False

TEMPLATE_DEBUG = False

DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"

DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}}
