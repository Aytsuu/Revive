from django.urls import path
from .views.account_views import *
from .views.product_views import *

urlpatterns = [
  path('api/create/user/', CreateAccountView.as_view(), name='create-user'),
  path('api/login/user/', AccountLoginView.as_view(), name='user-login'),
  path('api/create/product/', ProductCreateView.as_view(), name='create-product'),
  path('api/product/list/', ProductListView.as_view(), name='product-list'),
  path('api/update/product/', ProductUpdateView.as_view(), name='update-product'),
]