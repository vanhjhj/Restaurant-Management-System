from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .setting_config import RestaurantSettings
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class RestaurantSettingsAPIView(generics.GenericAPIView):

    parser_classes = (MultiPartParser, FormParser, JSONParser)

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
        
        # Xử lý cả data và files
        data = dict(request.data)
        
        # Loại bỏ files khỏi data dict để tránh trùng lặp
        files = {}
        for key in request.FILES:
            if key in data:
                del data[key]
            files[key] = request.FILES[key]
        
        # Update settings với cả data và files
        settings.update_with_files(data, files)
        
        return Response(settings.get_all(), status=status.HTTP_200_OK)