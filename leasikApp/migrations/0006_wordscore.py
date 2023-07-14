# Generated by Django 4.2.2 on 2023-07-14 17:49

import datetime
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("leasikApp", "0005_alter_word_unique_together"),
    ]

    operations = [
        migrations.CreateModel(
            name="WordScore",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "repetition_number",
                    models.IntegerField(
                        default=0,
                        validators=[
                            django.core.validators.MinValueValidator(0)
                        ],
                    ),
                ),
                ("easiness_factor", models.FloatField(default=2.5)),
                (
                    "inter_repetition_interval",
                    models.DurationField(
                        default=datetime.timedelta(0),
                        validators=[
                            django.core.validators.MinValueValidator(
                                datetime.timedelta(0)
                            )
                        ],
                        verbose_name="inter-repetition interval",
                    ),
                ),
                ("last_review_date", models.DateField(auto_now_add=True)),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "word",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="leasikApp.word",
                    ),
                ),
            ],
            options={
                "unique_together": {("word", "owner")},
            },
        ),
    ]
