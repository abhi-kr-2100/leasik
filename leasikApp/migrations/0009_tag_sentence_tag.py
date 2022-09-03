# Generated by Django 4.1 on 2022-09-03 12:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("leasikApp", "0008_alter_userprofile_owner"),
    ]

    operations = [
        migrations.CreateModel(
            name="Tag",
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
                ("label", models.CharField(max_length=50)),
            ],
        ),
        migrations.AddField(
            model_name="sentence",
            name="tag",
            field=models.ManyToManyField(to="leasikApp.tag"),
        ),
    ]
