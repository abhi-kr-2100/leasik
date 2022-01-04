# Generated by Django 4.0 on 2022-01-04 14:56

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('leasikApp', '0008_alter_list_unique_together_list_slug_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Proficiency',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('proficiency', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='auth.user')),
                ('word', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='leasikApp.word')),
            ],
            options={
                'unique_together': {('user', 'word')},
            },
        ),
    ]