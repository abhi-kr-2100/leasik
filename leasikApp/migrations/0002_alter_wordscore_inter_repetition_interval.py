# Generated by Django 4.2.3 on 2023-07-16 05:19

import datetime
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("leasikApp", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="wordscore",
            name="inter_repetition_interval",
            field=models.DurationField(
                default=datetime.timedelta(days=1),
                validators=[
                    django.core.validators.MinValueValidator(
                        datetime.timedelta(0)
                    )
                ],
                verbose_name="inter-repetition interval",
            ),
        ),
    ]
