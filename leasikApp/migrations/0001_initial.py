# Generated by Django 4.0.5 on 2022-06-11 04:59

import datetime
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Sentence',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('translation', models.TextField()),
            ],
            options={
                'unique_together': {('text', 'translation')},
            },
        ),
        migrations.CreateModel(
            name='SentenceList',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('is_public', models.BooleanField(default=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('sentences', models.ManyToManyField(blank=True, to='leasikApp.sentence')),
            ],
        ),
        migrations.CreateModel(
            name='Card',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('repetition_number', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0)])),
                ('easiness_factor', models.FloatField(default=2.5)),
                ('inter_repetition_interval', models.DurationField(default=datetime.timedelta(0), validators=[django.core.validators.MinValueValidator(0)], verbose_name='inter-repetition interval')),
                ('last_review_date', models.DateField(auto_now_add=True)),
                ('hidden_word_position', models.SmallIntegerField(default=-1)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('sentence', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='leasikApp.sentence')),
            ],
            options={
                'unique_together': {('owner', 'sentence', 'hidden_word_position')},
            },
        ),
    ]
