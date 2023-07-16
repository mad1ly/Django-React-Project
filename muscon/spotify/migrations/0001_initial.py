# Generated by Django 3.1.3 on 2023-07-15 17:25

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SpotifyToken',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=50, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('refresh_token', models.CharField(max_length=160)),
                ('access_token', models.CharField(max_length=160)),
                ('expires_in', models.DateTimeField()),
                ('token_type', models.CharField(max_length=50)),
            ],
        ),
    ]