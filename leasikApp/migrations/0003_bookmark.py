# Generated by Django 4.0.5 on 2022-06-29 15:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('leasikApp', '0002_alter_card_inter_repetition_interval'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bookmark',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('sentence', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='leasikApp.sentence')),
                ('sentence_list', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='leasikApp.sentencelist')),
            ],
        ),
    ]
