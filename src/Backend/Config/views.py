from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .setting_config import RestaurantSettings

class RestaurantSettingsAPIView(generics.GenericAPIView):
    def get_settings_instance(self):
        return RestaurantSettings()

    def get(self, request, *args, **kwargs):
        settings = self.get_settings_instance()
        return Response(settings.get_all(), status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        settings = self.get_settings_instance()
        settings.update(request.data, partial=False)
        return Response(settings.get_all(), status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        settings = self.get_settings_instance()
        settings.update(request.data, partial=True)
        return Response(settings.get_all(), status=status.HTTP_200_OK)