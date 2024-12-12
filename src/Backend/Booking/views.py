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
    ordering_fields = ['date', 'time', 'number_of_guests', 'status_order']
    filterset_class = ReservationFilterSet

    def get_queryset(self):
        queryset = super().get_queryset()

        # Nếu có tham số ordering trong request, áp dụng custom sắp xếp
        ordering = self.request.query_params.get('ordering', None)
        if ordering and 'status' in ordering:
            queryset = custom_status_reservation_order(queryset)  # Áp dụng sắp xếp tuỳ chỉnh theo status

        return queryset

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
            return Response({'message': 'Cannot update id field'}, status=status.HTTP_400_BAD_REQUEST)
        
        reservation = self.get_object()
        serializer = ReservationSerializer(reservation, data=request.data, partial=True)

        if serializer.is_valid():
            if serializer.validated_data.get('status') or serializer.validated_data.get('table'):
                return Response({'message': 'Cannot modify status and table at this API endpoint'}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()

            response = {
                'message': 'Reservation updated successfully',
                'data': ReservationSerializer(reservation).data
            }
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        reservation = self.get_object()
        reservation.delete()
        return Response({'message': 'Reservation deleted successfully'}, status=status.HTTP_200_OK)
    
class ReservationAssignTableAPIView(generics.UpdateAPIView):
    permission_classes = [IsEmployeeOrAdmin]
    queryset = Reservation.objects.all()
    serializer_class = ReservationAssignTableSerializer

    def put(self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        reservation = self.get_object()
        serializers = self.serializer_class(data=request.data, partial= False)

        if serializers.is_valid():
            #check if table is available and assign to reservation
            if serializers.validated_data['table'].status != 'A':
                #if reassign table
                if reservation.table and reservation.table == serializers.validated_data['table']:
                    return Response({'message': 'Table is already assigned to this reservation'}, status=status.HTTP_400_BAD_REQUEST)
                
                #if not, response table is not available
                return Response({'message': 'Table is not available'}, status=status.HTTP_400_BAD_REQUEST)
            
            #table is available
            #in case change table
            if reservation.table:
                reservation.table.status = 'A'
                reservation.table.save()

                reservation.table = serializers.validated_data['table']
                reservation.table.status = 'R'
                reservation.table.save()
            else: #in case assign table for the first time
                reservation.table = serializers.validated_data['table']
                reservation.table.status = 'R'
                reservation.table.save()

            reservation.status = 'A'
            reservation.save()

            response = {
                'message': 'Table assigned successfully',
                'data': ReservationSerializer(reservation).data
            }
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ReservationMarkDoneAPIView(generics.UpdateAPIView):
    permission_classes = [IsEmployeeOrAdmin]
    queryset = Reservation.objects.all()

    def put(self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        reservation = self.get_object()
        if reservation.status == 'D':
            return Response({'message': 'Reservation is already done'}, status=status.HTTP_400_BAD_REQUEST)
        
        if reservation.status == 'C':
            return Response({'message': 'Cannot mark canceled reservation as done'}, status=status.HTTP_400_BAD_REQUEST)
        
        if reservation.status == 'P':
            return Response({'message': 'Cannot mark pending reservation as done'}, status=status.HTTP_400_BAD_REQUEST)
        
        #only mark assigned reservation as done

        reservation.status = 'D'
        reservation.table.status = 'S'
        reservation.table.save()
        reservation.save()

        response = {
            'message': 'Reservation marked as done successfully',
            'data': ReservationSerializer(reservation).data
        }
        return Response(response, status=status.HTTP_200_OK)
    
class ReservationMarkCancelAPIView(generics.UpdateAPIView):
    permission_classes = [IsEmployeeOrAdmin]
    queryset = Reservation.objects.all()

    def put(self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        reservation = self.get_object()
        if reservation.status == 'C':
            return Response({'message': 'Reservation is already canceled'}, status=status.HTTP_400_BAD_REQUEST)
        
        if reservation.status == 'D':
            return Response({'message': 'Cannot mark done reservation as canceled'}, status=status.HTTP_400_BAD_REQUEST)
        
        #if reservation is assigned, update table status to available
        if reservation.status == 'A':
            reservation.table.status = 'A'
            reservation.table.save()

        #update status of reservation for both cases (P, A)
        reservation.status = 'C'
        reservation.save()

        response = {
            'message': 'Reservation marked as canceled successfully',
            'data': ReservationSerializer(reservation).data
        }
        return Response(response, status=status.HTTP_200_OK)

    
class GetCurrentTableReservationAPIView(generics.RetrieveAPIView):
    permission_classes = [IsEmployeeOrAdmin]
    queryset = Reservation.objects.all()

    def get(self, request, *args, **kwargs):
        table_id = kwargs.get('pk')
        try:
            reservation = Reservation.objects.filter(table=table_id, status='A').last()
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
        