from rest_framework import serializers, status
from rest_framework.response import Response
from ..models import Product

class ProductBaseSerializer(serializers.ModelSerializer):
  class Meta:
    model = Product
    fields = '__all__'

class ProductCreateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Product
    fields = '__all__'

  def create(self, validated_data):
    prod_name =  validated_data.get('prod_name', None)
    existing_prod = Product.objects.filter(prod_name=prod_name).first()

    if existing_prod:
      return
    
    product = Product(**validated_data)
    product.save()
    return product
  
class ProductUpdateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Product
    fields = '__all__'

  def update(self, instance, validated_data):
    prod_name = validated_data.get('prod_name', None)
    if prod_name:
        existing_prod = Product.objects.filter(prod_name=prod_name).exclude(pk=instance.pk).first()
        if existing_prod:
            raise serializers.ValidationError({'prod_name': 'Product with this name already exists.'})

    for attr, value in validated_data.items():
        setattr(instance, attr, value)
    instance.save()
    return instance
    

    