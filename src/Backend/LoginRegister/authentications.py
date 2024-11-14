from rest_framework.authentication import BaseAuthentication
from .models import Token
from rest_framework import exceptions
from django.utils import timezone

class CustomTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Lấy token từ header Authorization
        token = request.headers.get('Authorization')
        if not token:
            raise exceptions.AuthenticationFailed('Authentication credentials were not provided.')

        # Tách 'Bearer ' khỏi token nếu có
        token = token.split(' ')[1] if ' ' in token else token

        try:
            # Kiểm tra token trong cơ sở dữ liệu
            email = request.data.get('email')
            token_obj = Token.objects.get(email=email, token=token, revoked=False)
        except Token.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid or expired token. Check your email and token again.')

        #save token_obj to request
        request.token_obj = token_obj
        # Nếu token hợp lệ, trả về thông tin người dùng (ở đây là email)
        return (token_obj.email, None)  # Trả về email làm user (hoặc bạn có thể trả về user object)