# Generated by Django 4.0.1 on 2022-01-24 08:22

import datetime
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("leasikApp", "0004_card"),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="sentencenote",
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name="sentencenote",
            name="owner",
        ),
        migrations.RemoveField(
            model_name="sentencenote",
            name="sentence",
        ),
        migrations.AlterField(
            model_name="card",
            name="inter_repetition_interval",
            field=models.DurationField(
                default=datetime.timedelta(0),
                validators=[django.core.validators.MinValueValidator(0)],
                verbose_name="inter-repetition interval",
            ),
        ),
        migrations.DeleteModel(
            name="Proficiency",
        ),
        migrations.DeleteModel(
            name="SentenceNote",
        ),
    ]
