from rest_framework import generics,status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..serializers.cart_serializers import *

class CartListView(generics.ListAPIView):
  serializer_class = CartListSerializer

  def get_queryset(self):
    user_id = self.kwargs.get('user')
    return Cart.objects.select_related('prod').filter(acc=user_id)

class CartCreateView(generics.CreateAPIView):
  serializer_class = CartCreateSerializer
  queryset = Cart.objects.all()

class CartUpdateView(generics.CreateAPIView):
  serializer_class = CartBaseSerializer
  queryset = Cart.objects.all()
  
  def update(self, request, *args, **kwargs):
    instance = self.get_object()
    serializer = self.get_serializer(instance, data=request.data, partial=True)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)

  def get_object(self):
    prod = self.kwargs.get('prod')
    acc = self.kwargs.get('acc')
    obj = get_object_or_404(Cart, prod=prod, acc=acc)
    return obj

class CartBulkDeleteView(generics.DestroyAPIView):
  serializer_class = CartBaseSerializer
  queryset = Cart.objects.all()

  def delete(self, request, *args, **kwargs):
      account_id = request.data.get('acc')
      item_ids = request.data.get('items', [])       
      deleted_count, _ = Cart.objects.filter(
          cart_id__in=item_ids, 
          acc_id=account_id
      ).delete()
      
      return Response(
          {"message": f"Deleted {deleted_count} cart items"},
          status=status.HTTP_204_NO_CONTENT
      )