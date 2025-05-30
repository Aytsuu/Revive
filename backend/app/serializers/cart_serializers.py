from rest_framework import serializers
from ..models import Cart

class CartBaseSerializer(serializers.ModelSerializer):
  class Meta:
    model = Cart
    fields = '__all__'

class CartCreateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Cart
    fields = '__all__'

  def create(self,  validated_data):
    prod_id = validated_data.get('prod', None)
    acc_id = validated_data.get('acc', None)

    if prod_id and acc_id:
      existing = Cart.objects.filter(prod=prod_id, acc=acc_id)

      if existing:
        return
    
    cart = Cart(**validated_data)
    cart.save()
    return cart
