from django.db import models
from django.contrib.auth.models import AbstractUser

class Account(AbstractUser):
  email = models.EmailField()
  profile_image = models.URLField(max_length=500, null=True, blank=True)

  class Meta: 
    db_table = 'account'

class Product(models.Model):
  prod_id = models.BigAutoField(primary_key=True)
  prod_details = models.TextField()
  prod_quantity = models.IntegerField()
  prod_image = models.TextField()

  class Meta:
    db_table = 'product'

class Order(models.Model):
  ord_id = models.BigAutoField(primary_key=True)
  ord_date = models.DateField()
  ord_status = models.CharField(max_length=20)
  prod = models.ForeignKey(Product, on_delete=models.CASCADE)
  acc = models.ForeignKey(Account, on_delete=models.CASCADE)

  class Meta:
    db_table = 'order'

class Transaction(models.Model):
  trans_id = models.BigAutoField(primary_key=True)
  trans_amount = models.FloatField()
  prod = models.ForeignKey(Product, on_delete=models.CASCADE)
  acc = models.ForeignKey(Account, on_delete=models.CASCADE)

  class Meta:
    db_table = 'transaction'
  