# Generated by Django 5.2.1 on 2025-05-28 18:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_product_prod_brand_product_prod_price_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='prod_name',
            field=models.CharField(max_length=50),
            preserve_default=False,
        ),
    ]
