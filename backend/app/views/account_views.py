from rest_framework import generics, permissions
from rest_framework.authtoken.models import Token
from ..serializers.account_serializers import *
from ..models import Account

class CreateAccountView(generics.CreateAPIView):
  serializer_class = CreateAccountSerializer
  queryset = Account.objects.all()
  permission_classes = [permissions.AllowAny]

  def create(self, request, *args, **kwargs):
    account_serializer = self.get_serializer(data=request.data)
    account_serializer.is_Valid(raise_exception=True)
    user = account_serializer.save()
    Token.objects.get_or_create(user=user)

