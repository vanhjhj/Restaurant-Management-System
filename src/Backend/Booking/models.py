from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from phonenumber_field.modelfields import PhoneNumberField
import datetime
from Menu.models import MenuItem

# Create your models here.
class Table(models.Model):
    number_of_seats = models.IntegerField(validators=[MinValueValidator(1)])
    status = models.CharField(max_length=20, choices=[('A', 'Available'), ('R', 'Reserved'), ('S', 'Serving'), ('D', 'Done')], default='A')
    def __str__(self):
        return str(self.pk) + ' - ' + str(self.number_of_seats) + ' - ' + self.status

class Reservation(models.Model):
    guest_name = models.CharField(max_length=100, blank=False, null=False)
    phone_number = PhoneNumberField()
    date = models.DateField()
    time = models.TimeField()
    number_of_guests = models.IntegerField(validators=[MinValueValidator(1)])
    note = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[('P', 'Pending'), ('A', 'Assigned'), ('D', 'Done'), ('C', 'Canceled')], default='P')
    table = models.ForeignKey(Table, on_delete=models.DO_NOTHING, blank=True, null=True, default=None)

    def __str__(self):
        return self.guest_name + ' - ' + str(self.date) + ' - ' + str(self.time)
    
class Order(models.Model):
    datetime = models.DateTimeField(default=datetime.datetime.now)
    total_price = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(0)], default=0)
    total_discount = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(0)], default=0)
    final_price = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(0)], default=0)
    status = models.CharField(max_length=20, choices=[('P', 'Paid'), ('NP', 'Not Paid')], default='NP')
    table = models.ForeignKey(Table, related_name='orders', on_delete=models.DO_NOTHING)

    def __str__(self):
        return f"Order {self.pk} - {self.datetime.date()} - {self.final_price}"
    
    def add_item(self, menu_item: MenuItem, quantity):
        self.total_price += menu_item.price * quantity
        self.final_price += menu_item.price * quantity
        self.save()
    
    def remove_item(self, order_item):
        self.total_price -= order_item.total
        self.final_price -= order_item.total
        self.save()

    def update_total_when_change_quantity(self, order_item, new_quantity):
        #remove old total
        self.total_price -= order_item.total
        self.final_price -= order_item.total

        #update new total
        order_item.quantity = new_quantity
        order_item.save()

        self.total_price += order_item.total
        self.final_price += order_item.total
        self.save()

    def update_table_status(self):
        if self.status == 'NP': #Not Paid
            #check if there is any order item is preparing
            if OrderItem.objects.filter(order=self, status='P').exists():
                self.table.status = 'S' #Serving
            else:
                self.table.status = 'D' #Done
        else:
            self.table.status = 'A'

        self.table.save()
        
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
    order = models.ForeignKey(Order, related_name='details', on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, related_name='menu_item', on_delete=models.DO_NOTHING)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(0)])
    total = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(0)])
    note = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[('P', 'Preparing'), ('D', 'Done')], default='P')

    def __str__(self):
        return f"{self.order} - {self.menu_item} - {self.quantity} - {self.total}"

    def save(self, *args, **kwargs):
        self.price = self.menu_item.price
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
