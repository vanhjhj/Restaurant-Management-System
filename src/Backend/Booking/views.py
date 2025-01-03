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
import json
import os
from django.conf import settings
from django.core.mail import EmailMessage

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

        # employee only can update status, admin can update all fields
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

def send_confirmation_email(reservation):
        #get config
    with open(os.path.join(settings.BASE_DIR, 'Config', 'restaurant_configs.json')) as f:
        config = json.load(f)

    #get reservation info, reservation is serializer.validated_data
    ten_khach = reservation['guest_name']
    so_dien_thoai = reservation['phone_number']
    email = reservation['email']
    ngay = reservation['date']
    gio = reservation['time']
    so_khach = reservation['number_of_guests']
    ghi_chu = reservation['note']

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác nhận đặt bàn</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="text-align: center; color: #333;">Xác Nhận Đặt Bàn</h2>
            <p style="color: #333;">Chào quý khách,</p>
            <p style="color: #333;">Cảm ơn quý khách đã đặt bàn tại <strong>{config['name']}</strong>! Chúng tôi xin xác nhận thông tin đặt bàn của quý khách như sau:</p>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 10px 0;"><strong style="color: #0f6461;">Tên khách:</strong> {ten_khach}</p>
                <p style="margin: 10px 0;"><strong style="color: #0f6461;">Số điện thoại:</strong> {so_dien_thoai}</p>
                <p style="margin: 10px 0;"><strong style="color: #0f6461;">Email:</strong> {email}</p>
                <p style="margin: 10px 0;"><strong style="color: #0f6461;">Ngày:</strong> {ngay}</p>
                <p style="margin: 10px 0;"><strong style="color: #0f6461;">Giờ:</strong> {gio}</p>
                <p style="margin: 10px 0;"><strong style="color: #0f6461;">Số khách:</strong> {so_khach}</p>
                <p style="margin: 10px 0;"><strong style="color: #0f6461;">Ghi chú:</strong> {ghi_chu}</p>
            </div>

            <p style="color: #333;">Nếu quý khách cần thay đổi thông tin đặt bàn, vui lòng liên hệ với chúng tôi qua <a href="mailto:citrusroyale.restaurant@gmail.com" style="color: #0f6461;">citrusroyale.restaurant@gmail.com</a> hoặc gọi tới số <strong>0328840696</strong>.</p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="text-align: center; font-size: 14px; color: #aaa;">
                <strong>{config['name']}</strong><br>
                {config['address']}<br>
                {config['phone']}<br>
                <a href=`mailto:${config['email']}` style="color: #0f6461;">{config['email']}</a>
            </p>
        </div>
    </body>
    </html>
    """

    # Sending the email with HTML content
    email_message = EmailMessage(
        subject='Xác nhận đặt bàn tại Citrus Royale',
        body=html_content,
        from_email=settings.EMAIL_HOST_USER,
        to=[email],
    )
    email_message.content_subtype = "html"  # Specify email as HTML content
    email_message.send(fail_silently=False)
    return True

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
            queryset = custom_status_reservation_order(
                queryset)  # Áp dụng sắp xếp tuỳ chỉnh theo status

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
            # not allow to create reservation with status, it must be the the default value 'P'
            if 'status' in serializer.validated_data:
                return Response({'message': 'Cannot create reservation with status'}, status=status.HTTP_400_BAD_REQUEST)
            # not allow create reservation with table, it must be assigned by employee
            if 'table' in serializer.validated_data:
                return Response({'message': 'Cannot create reservation with table'}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()

            #reserve success, send confirmation email
            send_confirmation_email(serializer.validated_data)

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

    def put(self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def patch(self, request, *args, **kwargs):
        if 'id' in request.data:
            return Response({'message': 'Cannot update id field'}, status=status.HTTP_400_BAD_REQUEST)

        reservation = self.get_object()
        serializer = ReservationSerializer(
            reservation, data=request.data, partial=True)

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
        serializers = self.serializer_class(data=request.data, partial=False)

        if serializers.is_valid():
            # check if table is available and assign to reservation
            if serializers.validated_data['table'].status != 'A':
                # if reassign table
                if reservation.table and reservation.table == serializers.validated_data['table']:
                    return Response({'message': 'Table is already assigned to this reservation'}, status=status.HTTP_400_BAD_REQUEST)

                # if not, response table is not available
                return Response({'message': 'Table is not available'}, status=status.HTTP_400_BAD_REQUEST)

            # table is available
            # in case change table
            if reservation.table:
                reservation.table.status = 'A'
                reservation.table.save()

                reservation.table = serializers.validated_data['table']
                reservation.table.status = 'R'
                reservation.table.save()
            else:  # in case assign table for the first time
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


class ReservationUnassignTableAPIView(generics.UpdateAPIView):
    permission_classes = [IsEmployeeOrAdmin]
    queryset = Reservation.objects.all()

    def put(self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def patch(self, request, *args, **kwargs):
        reservation = self.get_object()

        if (not reservation.table) or (reservation.status != 'A'):
            return Response({'message': 'Reservation does not have any assigned table'}, status=status.HTTP_400_BAD_REQUEST)

        reservation.table.status = 'A'
        reservation.table.save()

        reservation.table = None
        reservation.status = 'P'
        reservation.save()

        response = {
            'message': 'Table unassigned successfully',
            'data': ReservationSerializer(reservation).data
        }

        return Response(response, status=status.HTTP_200_OK)


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

        # only mark assigned reservation as done

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

        # if reservation is assigned, update table status to available
        if reservation.status == 'A':
            reservation.table.status = 'A'
            reservation.table.save()

        # update status of reservation for both cases (P, A)
        reservation.status = 'C'
        reservation.save()

        response = {
            'message': 'Reservation marked as canceled successfully',
            'data': ReservationSerializer(reservation).data
        }
        return Response(response, status=status.HTTP_200_OK)


class GetLatestReservationAPIView(generics.ListAPIView):
    queryset = Reservation.objects.all()
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        # need phone_number to get latest reservation
        phone_number = request.query_params.get('phone_number', None)
        if not phone_number:
            return Response({'message': 'Phone number is required'}, status=status.HTTP_400_BAD_REQUEST)

        if Reservation.objects.filter(phone_number=phone_number).exists():
            reservation = Reservation.objects.filter(
                phone_number=phone_number).last()
            serializer = ReservationSerializer(reservation)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({'message': 'Phone number does not have any reservation'}, status=status.HTTP_404_NOT_FOUND)


class GetAllReservationAPIView(generics.ListAPIView):
    queryset = Reservation.objects.all()
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        phone_number = request.query_params.get('phone_number', None)

        if not phone_number:
            return Response({'message': 'Phone number is required'}, status=status.HTTP_400_BAD_REQUEST)

        if Reservation.objects.filter(phone_number=phone_number).exists():
            reservation = Reservation.objects.filter(phone_number=phone_number)
            serializer = ReservationSerializer(reservation, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({'message': 'Khách chưa từng đặt bàn'}, status=status.HTTP_200_OK)


class GetCurrentTableReservationAPIView(generics.RetrieveAPIView):
    permission_classes = [IsEmployeeOrAdmin]
    queryset = Reservation.objects.all()

    def get(self, request, *args, **kwargs):
        table_id = kwargs.get('pk')
        try:
            reservation = Reservation.objects.filter(
                table=table_id, status='A').last()
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
        # cannot create order with status
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


class OrderRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsEmployeeOrAdmin]

    def get_permissions(self):
        if self.request.method == "DELETE":
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    def delete(self, request, *args, **kwargs):
        order = self.get_object()
        order.delete()
        return Response({'message': 'Order deleted successfully'}, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def patch(self, request, *args, **kwargs):
        if 'id' in request.data:
            return Response({'message': 'Cannot update id field'}, status=status.HTTP_400_BAD_REQUEST)

        order = self.get_object()
        serializers = OrderSerializer(order, data=request.data, partial=True)

        if serializers.is_valid():
            if 'table' in serializers.validated_data:
                return Response({'message': 'Cannot update table in this API endpoint'}, status=status.HTTP_400_BAD_REQUEST)

            if 'status' in serializers.validated_data:
                return Response({'message': 'Cannot update status in this API endpoint'}, status=status.HTTP_400_BAD_REQUEST)

            for key, value in serializers.validated_data.items():
                if key == 'promotion':
                    if value:
                        promotion = Promotion.objects.get(pk=value.code)
                        min_order = promotion.min_order

                        if order.total_price < min_order:
                            return Response({'status': 'not_meet_requirement', 'message': f'Minimum order for this promotion is {min_order}'}, status=status.HTTP_400_BAD_REQUEST)

                        order.apply_discount(promotion.discount)
                    else:
                        order.remove_discount()

                setattr(order, key, value)

            order.save()

            response = {
                'message': 'Order updated successfully',
                'data': OrderSerializer(order).data
            }
            return Response(response, status=status.HTTP_200_OK)

        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderMarkPaidAPIView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    permission_classes = [IsEmployeeOrAdmin]

    def put(self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def patch(self, request, *args, **kwargs):
        order = self.get_object()

        if OrderItem.objects.filter(order=order, status='P').exists():
            return Response({'message': 'Cannot mark order as paid because there are items are preparing'}, status=status.HTTP_400_BAD_REQUEST)

        if order.status == 'P':
            return Response({'message': 'Cannot update status of paid order'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = 'P'

        # update table status
        order.update_table_status()

        order.save()

        response = {
            'message': 'Order status updated successfully',
            'data': OrderSerializer(order).data
        }
        return Response(response, status=status.HTTP_200_OK)


class ChangeTableOrderAPIView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    permission_classes = [IsEmployeeOrAdmin]

    def put(self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def patch(self, request, *args, **kwargs):
        order = self.get_object()
        serializers = OrderSerializer(data=request.data, partial=True)
        if serializers.is_valid():
            if 'table' not in serializers.validated_data:
                return Response({'message': 'Table is required'}, status=status.HTTP_400_BAD_REQUEST)

            if order.status == 'P':
                return Response({'message': 'Cannot change table of paid order'}, status=status.HTTP_400_BAD_REQUEST)

            table = Table.objects.get(
                pk=serializers.validated_data['table'].id)
            if table.status != 'A':
                return Response({'message': 'Table is not available'}, status=status.HTTP_400_BAD_REQUEST)

            # table is available

            # update current table status
            order.table.status = 'A'
            order.table.save()

            # assign new table
            order.table = table

            # update new table status
            order.update_table_status()

            order.save()

            response = {
                'message': 'Order table updated successfully',
                'data': OrderSerializer(order).data
            }
            return Response(response, status=status.HTTP_200_OK)

        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


class GetCurrentTableOrderAPIView(generics.RetrieveAPIView):
    permission_classes = [IsEmployeeOrAdmin]
    queryset = Order.objects.all()

    def get(self, request, *args, **kwargs):
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
            # get order and menu item
            order = Order.objects.get(
                pk=serializers.validated_data['order'].id)
            if order.status == 'P':
                return Response({'message': 'Cannot add item to paid order'}, status=status.HTTP_400_BAD_REQUEST)

            menu_item = MenuItem.objects.get(
                pk=serializers.validated_data['menu_item'].id)

            # update order total price and final price
            order.add_item(menu_item, serializers.validated_data['quantity'])

            response = {}

            # check if order item already exists
            # if exists, increase quantity
            # else, create new order item
            if OrderItem.objects.filter(order=order, menu_item=menu_item).exists():
                order_item = OrderItem.objects.filter(
                    order=order, menu_item=menu_item).first()
                order_item.quantity += serializers.validated_data['quantity']
                order_item.note = serializers.validated_data.get('note', '')

                # if order item is done, change status to preparing
                if order_item.status == 'D':
                    order_item.status = 'P'

                order_item.save()  # total and price will be updated in save method of OrderItem model
                serializers = OrderItemSerializer(order_item)
                response['data'] = serializers.data
            else:
                serializers.save()
                response['data'] = serializers.data

            # update table status
            order.update_table_status()

            response['message'] = 'Order item added successfully'
            return Response(response, status=status.HTTP_201_CREATED)

        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


class RemoveOrderItemAPIView(generics.DestroyAPIView):
    permission_classes = [IsEmployeeOrAdmin]
    queryset = OrderItem.objects.all()

    def delete(self, request, *args, **kwargs):
        order_item = self.get_object()
        order = Order.objects.get(pk=order_item.order.id)

        if order.status == 'P':
            return Response({'message': 'Cannot remove item from paid order'}, status=status.HTTP_400_BAD_REQUEST)

        if order_item.status == 'D':
            return Response({'message': 'Cannot remove done order item'}, status=status.HTTP_400_BAD_REQUEST)

        if len(OrderItem.objects.filter(order=order)) == 1:
            return Response({'message': 'Order must have at least one item'}, status=status.HTTP_400_BAD_REQUEST)

        order.remove_item(order_item)
        order_item.delete()

        # update table status
        order.update_table_status()

        return Response({'message': 'Order item removed successfully'}, status=status.HTTP_200_OK)


class MarkDoneOrderItemStatusAPIView(generics.UpdateAPIView):
    permission_classes = [IsEmployeeOrAdmin]
    queryset = OrderItem.objects.all()

    def put(self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def patch(self, request, *args, **kwargs):
        order_item = self.get_object()
        order = Order.objects.get(pk=order_item.order.id)

        if order.status == 'P':
            return Response({'message': 'Cannot update item in paid order'}, status=status.HTTP_400_BAD_REQUEST)

        if order_item.status == 'D':
            return Response({'message': 'Order item is already done'}, status=status.HTTP_400_BAD_REQUEST)

        order_item.status = 'D'
        order_item.save()

        # update table status
        order.update_table_status()

        response = {
            'message': 'Order item status updated successfully',
            'data': OrderItemSerializer(order_item).data
        }
        return Response(response, status=status.HTTP_200_OK)


class UpdateOrderItemAPIView(generics.UpdateAPIView):
    permission_classes = [IsEmployeeOrAdmin]
    queryset = OrderItem.objects.all()

    def put(self, request, *args, **kwargs):
        return Response({'message': 'PUT method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def patch(self, request, *args, **kwargs):
        serializers = OrderItemSerializer(data=request.data, partial=True)
        if serializers.is_valid():
            order_item = self.get_object()
            order = Order.objects.get(pk=order_item.order.id)

            if order.status == 'P':
                return Response({'message': 'Cannot update item in paid order'}, status=status.HTTP_400_BAD_REQUEST)

            if 'menu_item' in serializers.validated_data:
                return Response({'message': 'Cannot update menu item'}, status=status.HTTP_400_BAD_REQUEST)

            if 'status' in serializers.validated_data:
                return Response({'message': 'Cannot update status in this API endpoint'}, status=status.HTTP_400_BAD_REQUEST)

            for key, value in serializers.validated_data.items():
                if key == 'quantity':
                    if value < order_item.quantity and order_item.status == 'D':
                        return Response({'message': 'Cannot decrease quantity of done order item'}, status=status.HTTP_400_BAD_REQUEST)

                    if value > order_item.quantity:  # update status to preparing
                        order_item.status = 'P'

                    order.update_total_when_change_quantity(order_item, value)

                else:
                    setattr(order_item, key, value)

            # update table status
            order.update_table_status()

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


class FeedbackListCreateAPIView(generics.ListCreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    filterset_class = FeedbackFilterSet
    ordering_fields = ['serve_point', 'food_point',
                       'price_point', 'space_point', 'overall_point']
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = FeedbackSerializer(data=request.data)

        if serializer.is_valid():
            if Feedback.objects.filter(order=serializer.validated_data['order']).exists():
                return Response({'message': 'Feedback for this order already exists'}, status=status.HTTP_400_BAD_REQUEST)

            order = Order.objects.get(pk=serializer.validated_data['order'].id)
            if order.status != 'P':
                return Response({'message': 'Cannot feedback for unpaid order'}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            response = {
                'message': 'Feedback created successfully',
                'data': serializer.data
            }
            return Response(response, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
