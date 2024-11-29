from django.shortcuts import render
from .models import *
from .serializers import *
from .permissions import *
from .filters import *
from rest_framework.response import Response
from rest_framework import generics, permissions, authentication
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

# Create your views here.
class TableListCreateAPIView(generics.ListCreateAPIView):
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    ordering_fields = ['number_of_seats', 'status']
    filterset_class = TableFilterSet

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsEmployeeOrAdmin()]
        elif self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def post(self, request, *args, **kwargs):
        serializer = TableSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            response = {
                'message': 'Table created successfully',
                'data': serializer.data
            }
            return Response(response, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TableRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = [IsEmployeeOrAdmin]

    def get_permissions(self):
        if self.request.method == "DELETE":
            return [permissions.IsAdminUser()]
        return super().get_permissions()
        
    def put(self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        if 'id' in request.data:
            return Response({'message': 'Cannot update id field'}, status=status.HTTP_400_BAD_REQUEST)
        
        table = self.get_object()
        serializer = TableSerializer(table, data=request.data, partial=True)

        #employee only can update status, admin can update all fields
        if serializer.is_valid():
            if request.user.is_staff:
                serializer.save()
            else:
                if 'status' in request.data:
                    serializer.save()
                else:
                    return Response({'message': 'Only admin can update this field'}, status=status.HTTP_403_FORBIDDEN)

            response = {
                'message': 'Table updated successfully',
                'data': serializer.data
            }
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        table = self.get_object()
        table.delete()
        return Response({'message': 'Table deleted successfully'}, status=status.HTTP_200_OK)
    

class ReservationListCreateAPIView(generics.ListCreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    ordering_fields = ['date', 'number_of_guests']
    filterset_class = ReservationFilterSet

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsEmployeeOrAdmin()]
        elif self.request.method == 'POST':
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    def post(self, request, *args, **kwargs):
        serializer = ReservationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            response = {
                'message': 'Reservation created successfully',
                'data': serializer.data
            }
            return Response(response, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReservationRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [IsEmployeeOrAdmin]


    def put (self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        if 'id' in request.data:
            return Response({'message': 'Cannot update id field'}, status=status.HTTP_400_BAD_REQUEST)
        
        reservation = self.get_object()
        serializer = ReservationSerializer(reservation, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            response = {
                'message': 'Reservation updated successfully',
                'data': serializer.data
            }
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        reservation = self.get_object()
        reservation.delete()
        return Response({'message': 'Reservation deleted successfully'}, status=status.HTTP_200_OK)

class OrderListCreateAPIView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    ordering_fields = ['date', 'final_price', 'total_discount', 'total_price']
    filterset_class = OrderFilterSet

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAdminUser()]
        elif self.request.method == 'POST':
            return [IsEmployeeOrAdmin()]
        return super().get_permissions()
    
    def post(self, request, *args, **kwargs):
        #cannot create order with status
        if 'status' in request.data:
            return Response({'message': 'Cannot create order with status'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            response = {
                'message': 'Order created successfully',
                'data': serializer.data
            }
            return Response(response, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class OrderRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsEmployeeOrAdmin]

    def get_permissions(self):
        if self.request.method == "DELETE":
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def put(self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        if 'id' in request.data:
            return Response({'message': 'Cannot update id field'}, status=status.HTTP_400_BAD_REQUEST)
        
        order = self.get_object()
        serializer = OrderSerializer(order, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            response = {
                'message': 'Order updated successfully',
                'data': serializer.data
            }
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        order = self.get_object()
        order.delete()
        return Response({'message': 'Order deleted successfully'}, status=status.HTTP_200_OK)
    
class GetCurrentTableOrderAPIView(generics.RetrieveAPIView):
    permission_classes = [IsEmployeeOrAdmin]
    queryset = Order.objects.all()

    def get (self, request, *args, **kwargs):
        table_id = kwargs.get('pk')
        try:
            order = Order.objects.get(table=table_id, status='NP')
            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({'message': 'Table does not have any order'}, status=status.HTTP_404_NOT_FOUND)
    
        