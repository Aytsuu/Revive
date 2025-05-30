from django.db import models
from django.contrib.auth.models import AbstractUser

class Account(AbstractUser):
  email = models.EmailField()
  name = models.CharField(max_length=50)
  dob = models.DateField()
  contact = models.CharField(max_length=11)
  profile_image = models.URLField(max_length=500, null=True, blank=True)

  class Meta: 
    db_table = 'account'

class Product(models.Model):
  prod_id = models.BigAutoField(primary_key=True)
  prod_name = models.CharField(max_length=50)
  prod_details = models.TextField()
  prod_price = models.FloatField()
  prod_stock = models.IntegerField()
  prod_brand = models.CharField(max_length=50)
  prod_image = models.URLField(max_length=500, null=True, blank=True)

  class Meta:
    db_table = 'product'

class Order(models.Model):
  ord_id = models.BigAutoField(primary_key=True)
  ord_date = models.DateField()
  ord_quantity = models.IntegerField()
  ord_amount = models.FloatField()
  ord_status = models.CharField(max_length=20)
  prod = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
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

class Cart(models.Model):
  cart_id = models.BigAutoField(primary_key=True)
  cart_quantity = models.IntegerField()
  prod = models.ForeignKey(Product, on_delete=models.CASCADE)
  acc = models.ForeignKey(Account, on_delete=models.CASCADE)

  class Meta:
    db_table = 'cart'

class Feedback(models.Model):
  feed_id = models.BigAutoField(primary_key=True)
  feed_commnet = models.TextField()
  feed_date = models.DateField(auto_now_add=True)

  class Meta:
    db_table = 'feedback'