# Generated by Django 4.0.2 on 2022-02-03 15:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("leasikApp", "0008_remove_sentencelist_bookmarked_sentences_and_more"),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="card",
            unique_together=set(),
        ),
        migrations.AddField(
            model_name="card",
            name="hidden_word_position",
            field=models.SmallIntegerField(default=-1),
        ),
    ]