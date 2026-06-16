from django.db import models

class EnvConfig(models.Model):
    """
    Virtual model to edit the .env configuration file directly from Django Admin.
    Does not map to a database table.
    """
    class Meta:
        verbose_name = "Environment Configurator"
        verbose_name_plural = "Environment Configurator"
        managed = False
