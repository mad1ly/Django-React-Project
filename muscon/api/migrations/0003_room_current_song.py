# Generated by Django 3.1.3 on 2023-07-16 19:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20230715_1923'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='current_song',
            field=models.CharField(max_length=50, null=True),
        ),
    ]