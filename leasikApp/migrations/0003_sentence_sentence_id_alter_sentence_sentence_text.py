# Generated by Django 4.0 on 2022-01-04 11:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leasikApp', '0002_remove_word_sentences'),
    ]

    operations = [
        migrations.AddField(
            model_name='sentence',
            name='sentence_id',
            field=models.IntegerField(default=0, primary_key=True, serialize=False, verbose_name='Tatoeba sentence ID'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='sentence',
            name='sentence_text',
            field=models.TextField(blank=True),
        ),
    ]