from django.urls import path
from .views.account_views import *
from .views.product_views import *
from .views.cart_views import *

urlpatterns = [
  path('api/create/user/', CreateAccountView.as_view(), name='create-user'),
  path('api/login/user/', AccountLoginView.as_view(), name='user-login'),
  path('api/create/product/', ProductCreateView.as_view(), name='create-product'),
  path('api/product/list/', ProductListView.as_view(), name='product-list'),
  path('api/update/product/<int:prod_id>/', ProductUpdateView.as_view(), name='update-product'),
  path('api/delete/product/<int:prod_id>/', ProductDeleteView.as_view(), name='delete-product'),
  path('api/create/cart/', CartCreateView.as_view(), name='add-cart'),
  path('api/cart/list/<int:user>/', CartListView.as_view(), name='cart-list'),
  path('api/update/cart/<int:prod>/<int:acc>/', CartUpdateView.as_view(), name='update-cart'),
  path('api/delete/cart/<int:prod>/<int:acc>/', CartBulkDeleteView.as_view(), name='delete-cart-item')
]