from django.apps import AppConfig


class LeasikappConfig(AppConfig):
    # Some DBs — such as CockroachDB — use very large default IDs. We need
    # BigAutoField for those.
    default_auto_field = "django.db.models.BigAutoField"

    name = "leasikApp"
