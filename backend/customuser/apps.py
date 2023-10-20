from django.apps import AppConfig


class CustomuserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'customuser'

    def ready(self) -> None:
        # import customuser.signals
        pass
