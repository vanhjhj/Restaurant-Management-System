from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .setting_config import RestaurantSettings

class RestaurantSettingsAPIView(generics.GenericAPIView):

    def get_permissions(self):
        if self.request.method == 'PATCH':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_settings_instance(self):
        return RestaurantSettings()

    def get(self, request, *args, **kwargs):
        settings = self.get_settings_instance()
        return Response(settings.get_all(), status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        settings = self.get_settings_instance()
        settings.update(request.data, partial=True)
        return Response(settings.get_all(), status=status.HTTP_200_OK)