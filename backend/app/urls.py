from django.urls import path
from .views.account_views import *

urlpatterns = [
  path('api/create/user/', CreateAccountView.as_view(), name='create-user'),
]