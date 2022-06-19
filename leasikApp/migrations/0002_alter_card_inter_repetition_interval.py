# Generated by Django 4.0.5 on 2022-06-19 19:22

import datetime
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("leasikApp", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="card",
            name="inter_repetition_interval",
            field=models.DurationField(
                default=datetime.timedelta(0),
                validators=[
                    django.core.validators.MinValueValidator(
                        datetime.timedelta(0)
                    )
                ],
                verbose_name="inter-repetition interval",
            ),
        ),
    ]