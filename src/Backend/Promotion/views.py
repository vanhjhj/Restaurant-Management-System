from django.shortcuts import render
from .models import Promotion
from .serializers import PromotionSerializer
from rest_framework import generics,permissions, status
from rest_framework.response import Response

# Create your views here.
class PromotionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()
    
    def get(self, request, *args, **kwargs):
        promotions = Promotion.objects.all()
        serializer = self.serializer_class(promotions, many=True)
        #filer by type
        type = request.query_params.get('type', None)
        if type is not None:
            promotions = promotions.filter(type=type)
            serializer = self.serializer_class(promotions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        promotion_data = request.data
        serializer = self.serializer_class(data=promotion_data)

        if serializer.is_valid(raise_exception=True):
            if serializer.validated_data['type'] == 'KMTV': #if promotion is for members, dont need startdate and enddate
                serializer.validated_data['startdate'] = None
                serializer.validated_data['enddate'] = None
            else:
                if serializer.validated_data['startdate'] is None or serializer.validated_data['enddate'] is None:
                    return Response({'message': 'Please provide startdate and enddate'}, status=status.HTTP_400_BAD_REQUEST)
                if serializer.validated_data['startdate'] >= serializer.validated_data['enddate']:
                    return Response({'message': 'Enddate must be greater than startdate'}, status=status.HTTP_400_BAD_REQUEST)

            promotion = serializer.save()
            response = {
                'data': serializer.data,
                'status': 'success',
                'message': 'Promotion created successfully'
            }
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PromotionRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'code'  

    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()
    
    def put(self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def patch(self, request, *args, **kwargs):

        if 'code' in request.data:
            return Response({'message': 'Cannot update code field'}, status=status.HTTP_400_BAD_REQUEST)
        
        promotion = self.get_object()  
        serializer = self.serializer_class(promotion, data=request.data, partial=True)
        
        if serializer.is_valid(raise_exception=True):
            serializer.save()

            response = {
                'data': serializer.data,
                'status': 'success',
                'message': 'Promotion updated successfully'
            }
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
