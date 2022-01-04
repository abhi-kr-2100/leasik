# Generated by Django 4.0 on 2022-01-04 10:37

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Sentence',
            fields=[
                ('sentence_text', models.TextField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Word',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('word_text', models.CharField(max_length=50)),
                ('language', models.CharField(choices=[('en', 'English'), ('tr', 'Türkçe')], max_length=2)),
                ('sentences', models.ManyToManyField(to='leasikApp.Sentence')),
            ],
            options={
                'unique_together': {('word_text', 'language')},
            },
        ),
    ]
