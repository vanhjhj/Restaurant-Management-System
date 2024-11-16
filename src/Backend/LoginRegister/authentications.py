from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from rest_framework_simplejwt.tokens import TokenError
import jwt
from django.conf import settings
from rest_framework_simplejwt.settings import api_settings

class CustomTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        header = request.headers.get('Authorization')
        if not header:
            raise exceptions.AuthenticationFailed('Authentication credentials were not provided.')
        
        token = header.split(' ')[1] if ' ' in header else header
    
        try:
            decoded = self.decode_custom_token(token)
            email = decoded.get('email')

            email_from_request = request.data.get('email')  # get email from request data

            if email != email_from_request:
                raise exceptions.AuthenticationFailed('Email does not match the OTP token.')
        except TokenError as e:
            # Token is invalid or expired
            raise exceptions.AuthenticationFailed(str(e))
    
        return (email, None)
    
    def decode_custom_token(token):
        # save original settings
        original_user_id_field = api_settings.USER_ID_FIELD
        original_user_id_claim = api_settings.USER_ID_CLAIM

        # override settings
        api_settings.USER_ID_FIELD = 'email'
        api_settings.USER_ID_CLAIM = 'email'

        try:
            # decode token
            decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            return decoded
        except jwt.ExpiredSignatureError:
            raise TokenError('Token is expired')
        except jwt.DecodeError:
            raise TokenError('Token is invalid')
        finally:
            # restore original settings
            api_settings.USER_ID_FIELD = original_user_id_field
            api_settings.USER_ID_CLAIM = original_user_id_claim
    