from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework import generics,permissions, status
from rest_framework.response import Response
# Create your views here.
class CategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]

    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()
    
    def post(self, request, *args, **kwargs):
        category_data = request.data
        serializer = self.serializer_class(data=category_data)

        if serializer.is_valid(raise_exception=True):
            category = serializer.save()
            response = {
                'data': serializer.data,
                'status': 'success',
                'message': 'Category created successfully'
            }
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CategoryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]

    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()
    
    def put(self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def patch(self, request, *args, **kwargs):
        if 'id' in request.data:
            return Response({'message': 'Cannot update id field'}, status=status.HTTP_400_BAD_REQUEST)
        category = self.get_object()
        serializer = self.serializer_class(category, data=request.data, partial=True)
        if (serializer.is_valid(raise_exception=True)):
            for key, value in request.data.items():
                setattr(category, key, value)

                serializer.save()

                response = {
                    'data': serializer.data,
                    'status': 'success',
                    'message': 'Category updated successfully'
                }
                return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        category = self.get_object()
        try:
            category.delete()
        except IntegrityError:
            return Response({'message': 'Cannot delete this category due to integrity constraints.'}, status=status.HTTP_400_BAD_REQUEST)

        response = {
            'status': 'success',
            'message': 'Category deleted successfully'
        }
        return Response(response, status=status.HTTP_200_OK)

class MenuItemListCreateAPIView(generics.ListCreateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAdminUser]
    search_fields=['category__name']
    ordering_fields=['price','category__name','name']

    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()
    
    def post(self, request, *args, **kwargs):
        menuitem_data = request.data
        serializer = self.serializer_class(data=menuitem_data)

        if serializer.is_valid(raise_exception=True):
            menuitem = serializer.save()
            response = {
                'data': serializer.data,
                'status': 'success',
                'message': 'Menu item created successfully'
            }
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MenuItemRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()
    
    def put(self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        if 'id' in request.data:
            return Response({'message': 'Cannot update id field'}, status=status.HTTP_400_BAD_REQUEST)
        menuitem = self.get_object()
        serializer = self.serializer_class(menuitem, data=request.data, partial=True)
        if (serializer.is_valid(raise_exception=True)):
            for key, value in request.data.items():
                if key == 'category':
                    category = Category.objects.get(id=value)
                    setattr(menuitem, key, category)
                else:
                    setattr(menuitem, key, value)

            serializer.save()

            response = {
                'data': serializer.data,
                'status': 'success',
                'message': 'Menu item updated successfully'
            }
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        menuitem = self.get_object()
        try:
            menuitem.delete()
        except IntegrityError:
            return Response({'message': 'Cannot delete this menu item due to integrity constraints.'}, status=status.HTTP_400_BAD_REQUEST)

        response = {
            'status': 'success',
            'message': 'Menu item deleted successfully'
        }
        return Response(response, status=status.HTTP_200_OK)