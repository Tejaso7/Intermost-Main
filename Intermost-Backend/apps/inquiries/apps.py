from django.apps import AppConfig


class InquiriesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.inquiries'
    verbose_name = 'Inquiries'

    def ready(self):
        try:
            from .drip_worker import start_drip_worker
            start_drip_worker()
        except Exception as e:
            import logging
            logging.getLogger(__name__).error(f"Error starting drip worker: {e}")
