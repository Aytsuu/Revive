from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from rest_framework.authtoken.models import Token
from ..serializers.account_serializers import *
from ..models import Account

class CreateAccountView(generics.CreateAPIView):
  serializer_class = CreateAccountSerializer
  queryset = Account.objects.all()
  permission_classes = [permissions.AllowAny]

  def create(self, request, *args, **kwargs):
    account_serializer = self.get_serializer(data=request.data)
    account_serializer.is_valid(raise_exception=True)
    user = account_serializer.save()
    token,_ = Token.objects.get_or_create(user=user)

    return Response({
      'user': CreateAccountSerializer(user, context=self.get_serializer_context()).data,
      'token': token.key
    }, status=status.HTTP_201_CREATED)

class AccountLoginView(APIView):
  permission_classes = [permissions.AllowAny]
  
  def post(self, request): 
    email_or_username = request.data.get('email_or_username')
    password = request.data.get('password')

    if email_or_username and password:
      try:
        user = Account.objects.get(
          Q(email=email_or_username) | Q(username=email_or_username)
        )

        if not user.check_password(password):
          return Response(
            {'error': 'Incorrect Credentials'},
            status=status.HTTP_401_UNAUTHORIZED
          )
        
        Token.objects.get_or_create(user=user)

        return Response({
          'username': user.username,
          'email': user.email
        })

      except Account.DoesNotExist:
        return Response(
          {'error' : 'Account does not exist'},
          status=status.HTTP_404_NOT_FOUND
        )
      
      except Exception as e:
        return Response(
          {'error': 'An unexpected error has occurred'},
          status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )