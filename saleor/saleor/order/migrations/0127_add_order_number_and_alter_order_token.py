# Generated by Django 3.2.12 on 2022-02-18 09:14
import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("order", "0126_alter_order_updated_at"),
    ]

    operations = [
        migrations.AlterField(
            model_name="order",
            name="token",
            field=models.UUIDField(default=uuid.uuid4, unique=True),
        ),
        migrations.AddField(
            model_name="order",
            name="use_old_id",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="order",
            name="number",
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
