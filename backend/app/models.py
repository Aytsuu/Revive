from django.db import models
from django.contrib.auth.models import AbstractUser

class Account(AbstractUser):
  email = models.EmailField()
  profile_image = models.URLField(max_length=500)

  class Meta: 
    db_table = 'account'


