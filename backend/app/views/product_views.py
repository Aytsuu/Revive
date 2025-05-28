from rest_framework import generics
from ..serializers.product_serializers import *

class ProductCreateView(generics.CreateAPIView):
  serializer_class = ProductCreateSerializer
  queryset = Product.objects.all()

class ProductListView(generics.ListAPIView):
  serializer_class = ProductBaseSerializer
  queryset = Product.objects.all()

class ProductUpdateView(generics.UpdateAPIView):
  serializer_class = ProductUpdateSerializer
  queryset = Product.objects.all()
  lookup_field = 'prod_id'
    

