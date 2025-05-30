from rest_framework import serializers
from ..models import Cart

class CartBaseSerializer(serializers.ModelSerializer):
  class Meta:
    model = Cart
    fields = '__all__'

class CartListSerializer(serializers.ModelSerializer):
    prod_id = serializers.IntegerField(source='prod.prod_id', read_only=True)
    prod_name = serializers.CharField(source='prod.prod_name', read_only=True)
    prod_price = serializers.FloatField(source='prod.prod_price', read_only=True)
    prod_image = serializers.URLField(source='prod.prod_image', read_only=True)
    
    class Meta:
        model = Cart
        fields = ['cart_id', 'cart_quantity', 'prod_id', 'prod_name', 
                'prod_price', 'prod_image', 'acc']

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
