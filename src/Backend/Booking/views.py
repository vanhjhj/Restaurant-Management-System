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
from Menu.models import MenuItem

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
                if 'number_of_seats' in request.data:
                    return Response({'message': 'Only admin can update this field'}, status=status.HTTP_403_FORBIDDEN)
                serializer.save()

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
            #not allow to create reservation with status, it must be the the default value 'P'
            if 'status' in serializer.validated_data:
                return Response({'message': 'Cannot create reservation with status'}, status=status.HTTP_400_BAD_REQUEST)
            #not allow create reservation with table, it must be assigned by employee
            if 'table' in serializer.validated_data:
                return Response({'message': 'Cannot create reservation with table'}, status=status.HTTP_400_BAD_REQUEST)
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
            return Response({'message': 'Cannot update id field'}, status=new_status.HTTP_400_BAD_REQUEST)
        
        reservation = self.get_object()
        serializer = ReservationSerializer(reservation, data=request.data, partial=True)

        if serializer.is_valid():
            current_status = reservation.status
            current_table = reservation.table
            new_status = serializer.validated_data.get('status')
            table = serializer.validated_data.get('table')

            if current_status == 'P':
                if new_status == 'D':
                    return Response({'message': 'Status must be A (Assigned) before change to D (Done)'}, status=status.HTTP_400_BAD_REQUEST)
                if not new_status and table:
                    return Response({'message': 'Cannot assign table to pending reservation'}, status=status.HTTP_400_BAD_REQUEST)
                if new_status == 'A':
                    if not table:
                        return Response({'message': 'Table is required when status is A (Assigned)'}, status=status.HTTP_400_BAD_REQUEST)
                    if table.status != 'A':
                        return Response({'message': f'Table is not available, it is currently {table.get_status_display()}'}, status=status.HTTP_400_BAD_REQUEST)
                    table.status = 'R'
                    table.save()

            elif current_status == 'A':
                if table:
                    #change table and update status of old table
                    if table.status != 'A':
                        return Response({'message': f'Table is not available, it is currently {table.get_status_display()}'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    current_table.status = 'A'
                    current_table.save()
                    table.status = 'R'
                    table.save()
                
                if new_status == 'P':
                    #update table status to 'A' (Available) when reservation is pending
                    current_table.status = 'A'
                    reservation.table = None
                    reservation.save()
                elif new_status == 'D':
                    #update table status to 'S' (Serving) when reservation is done
                    current_table.status = 'S'
                current_table.save()
            
            elif current_status == 'D':
                if new_status:
                    return Response({'message': 'Cannot change status of done reservation'}, status=status.HTTP_400_BAD_REQUEST)
                if table:
                    return Response({'message': 'Cannot change table of done reservation'}, status=status.HTTP_400_BAD_REQUEST)

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
    
class GetCurrentTableReservationAPIView(generics.RetrieveAPIView):
    permission_classes = [IsEmployeeOrAdmin]
    queryset = Reservation.objects.all()

    def get(self, request, *args, **kwargs):
        table_id = kwargs.get('pk')
        try:
            reservation = Reservation.objects.get(table=table_id, status='A')
            serializer = ReservationSerializer(reservation)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Reservation.DoesNotExist:
            return Response({'message': 'Table does not have any reservation'}, status=status.HTTP_404_NOT_FOUND)

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
        
class AddOrderItemAPIView(generics.CreateAPIView):
    permission_classes = [IsEmployeeOrAdmin]
    serializer_class = OrderItemSerializer

    def post(self, request, *args, **kwargs):
        serializers = OrderItemSerializer(data=request.data)
        if serializers.is_valid():
            #get order and menu item
            order  = Order.objects.get(pk=serializers.validated_data['order'].id)
            if order.status == 'P':
                return Response({'message': 'Cannot add item to paid order'}, status=status.HTTP_400_BAD_REQUEST)
            
            menu_item = MenuItem.objects.get(pk=serializers.validated_data['menu_item'].id)

            #update order total price and final price
            order.add_item(menu_item, serializers.validated_data['quantity'])

            response = {}

            #check if order item already exists
            #if exists, increase quantity
            #else, create new order item
            if OrderItem.objects.filter(order=order, menu_item=menu_item).exists():
                order_item = OrderItem.objects.filter(order=order, menu_item=menu_item).first()
                order_item.quantity += serializers.validated_data['quantity']
                order_item.note = serializers.validated_data.get('note', '')
                order_item.save() #total and price will be updated in save method of OrderItem model
                serializers = OrderItemSerializer(order_item)
                response['data'] = serializers.data
            else:
                serializers.save()
                response['data'] = serializers.data

            response['message'] = 'Order item added successfully'
            return Response(response, status=status.HTTP_201_CREATED)
        
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RemoveOrderItemAPIView(generics.DestroyAPIView):
    permission_classes = [IsEmployeeOrAdmin]
    queryset = OrderItem.objects.all()

    def delete(self, request, *args, **kwargs):
        if 'menu_item' not in request.data or 'order' not in request.data:
            return Response({'message': 'Menu item and order are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order_item = OrderItem.objects.get(menu_item=request.data['menu_item'], order=request.data['order'])
            order = Order.objects.get(pk=request.data['order'])

            if order.status == 'P':
                return Response({'message': 'Cannot remove item from paid order'}, status=status.HTTP_400_BAD_REQUEST)
            
            if len(OrderItem.objects.filter(order=order)) == 1:
                return Response({'message': 'Order must have at least one item'}, status=status.HTTP_400_BAD_REQUEST)
            
            order.remove_item(order_item)
            order_item.delete()

            return Response({'message': 'Order item removed successfully'}, status=status.HTTP_200_OK)
        
        except OrderItem.DoesNotExist:
            return Response({'message': 'Order item does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Order.DoesNotExist:
            return Response({'message': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
class UpdateOrderItemAPIView(generics.UpdateAPIView):
    permission_classes = [IsEmployeeOrAdmin]

    def put(self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        serializers = OrderItemSerializer(data=request.data, partial=True)
        if serializers.is_valid():
            order_item = OrderItem.objects.get(order=serializers.validated_data['order'], menu_item=serializers.validated_data['menu_item'])
            order = Order.objects.get(pk=serializers.validated_data['order'].id)

            if order.status == 'P':
                return Response({'message': 'Cannot update item in paid order'}, status=status.HTTP_400_BAD_REQUEST)
            
            #update other fields
            for key, value in serializers.validated_data.items():
                if key == 'quantity':
                    order.update_total_when_change_quantity(order_item, value)
                else:
                    setattr(order_item, key, value)
            order_item.save()

            response = {
                'message': 'Order item updated successfully',
                'data': OrderItemSerializer(order_item).data
            }
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
    
class OrderItemListAPIView(generics.ListAPIView):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    filterset_class = OrderItemFilterSet
    ordering_fields = ['quantity', 'price', 'total']
    permission_classes = [IsEmployeeOrAdmin]
        