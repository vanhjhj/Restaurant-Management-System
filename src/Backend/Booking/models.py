from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from phonenumber_field.modelfields import PhoneNumberField
import datetime
from Menu.models import MenuItem

# Create your models here.
class Table(models.Model):
    number_of_seats = models.IntegerField(validators=[MinValueValidator(1)])
    status = models.CharField(max_length=20, choices=[('Available', 'Available'), ('Reserved', 'Reserved'), ('Order Placed', 'Order Placed'), ('Order Fully Served', 'Order Fully Served')], default='Available')
    def __str__(self):
        return str(self.pk) + ' - ' + str(self.number_of_Seats) + ' - ' + self.status


class Reservation(models.Model):
    guest_name = models.CharField(max_length=100, blank=False, null=False)
    phone_number = PhoneNumberField()
    date = models.DateField()
    time = models.TimeField()
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.guest_name + ' - ' + str(self.date) + ' - ' + str(self.time)
    

class Order(models.Model):
    date = models.DateField(default=datetime.date.today)
    total_price = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(0)], default=0)
    total_discount = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(0)], default=0)
    final_price = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(0)], default=0)

    def __str__(self):
        return f"Order {self.pk} - {self.date} - {self.final_price}"
    
    def add_item(self, menu_item: MenuItem, quantity):
        order_item = OrderItem.objects.create(order=self, menu_item=menu_item, quantity=quantity, price=menu_item.price)
        self.total_price += order_item.total
        self.final_price += order_item.total
        self.save()
        return order_item
    
    def remove_item(self, order_item):
        self.total_price -= order_item.total
        self.final_price -= order_item.total
        order_item.delete()
        self.save()

    def increase_quantity(self, order_item, quantity=1):
        order_item.quantity += quantity
        self.total_price += order_item.price
        self.final_price += order_item.price
        order_item.save()
        self.save()

    def decrease_quantity(self, order_item, quantity=1):
        order_item.quantity -= quantity

        if order_item.quantity <= 0:
            self.remove_item(order_item)
            return
        
        self.total_price -= order_item.price
        self.final_price -= order_item.price
        order_item.save()
        self.save()

    def apply_discount(self, discount):
        self.total_discount = discount
        self.final_price -= discount
        self.save()

    def remove_discount(self):
        self.final_price += self.total_discount
        self.total_discount = 0
        self.save()
    
    def save(self, *args, **kwargs):
        self.final_price = self.total_price - self.total_discount
        super().save(*args, **kwargs)
    

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='details', on_delete=models.CASCADE, )
    menu_item = models.ForeignKey(MenuItem, related_name='menu_item', on_delete=models.DO_NOTHING)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(0)])
    total = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(0)])
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.order} - {self.menu_item} - {self.quantity} - {self.total}"
    
    def __init__(self, *args, **kwargs):
        self.price = self.menu_item.price
        self.total = self.price * self.quantity
        super().__init__(*args, **kwargs)

    def save(self, *args, **kwargs):
        self.total = self.price * self.quantity
        super().save(*args, **kwargs)

class Feedback(models.Model):
    order = models.ForeignKey(Order, related_name='feedback', on_delete=models.CASCADE)
    server_point = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=1)
    food_point = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=1)
    price_point = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=1)
    space_point = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=1)
    comment = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.order}"
