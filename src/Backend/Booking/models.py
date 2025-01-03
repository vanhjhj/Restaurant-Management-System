from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from phonenumber_field.modelfields import PhoneNumberField
import datetime
from Menu.models import MenuItem
from Promotion.models import Promotion

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
    total_price = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    total_discount = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    final_price = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    status = models.CharField(max_length=20, choices=[('P', 'Paid'), ('NP', 'Not Paid')], default='NP')
    table = models.ForeignKey(Table, related_name='orders', on_delete=models.DO_NOTHING)
    promotion = models.ForeignKey(Promotion, related_name='orders', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Order {self.pk} - {self.datetime.date()} - {self.final_price}"
    
    def add_item(self, menu_item: MenuItem, quantity):
        self.total_price += menu_item.price * quantity
        self.save()
    
    def remove_item(self, order_item):
        self.total_price -= order_item.total
        self.save()

    def update_total_when_change_quantity(self, order_item, new_quantity):
        #remove old total
        self.total_price -= order_item.total

        #update new total
        order_item.quantity = new_quantity
        order_item.save()

        self.total_price += order_item.total
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
        
    def apply_discount(self, discount): #discount is percentage
        self.total_discount = self.total_price * discount / 100
        self.save()

    def remove_discount(self):
        self.total_discount = 0
        self.save()
    
    def save(self, *args, **kwargs):
        self.total_discount = Promotion.objects.get(pk=self.promotion.code).discount * self.total_price / 100 if self.promotion else 0
        self.final_price = self.total_price - self.total_discount
        super().save(*args, **kwargs)
    

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='details', on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, related_name='menu_item', on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    price = models.IntegerField(validators=[MinValueValidator(0)])
    total = models.IntegerField(validators=[MinValueValidator(0)])
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
    name = models.CharField(max_length=100, blank=True, null=True)
    date = models.DateTimeField(default=datetime.datetime.now)
    serve_point = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=5)
    food_point = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=5)
    price_point = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=5)
    space_point = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=5)
    overall_point = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(0)])
    comment = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.order}"
    
    def save(self, *args, **kwargs):
        self.overall_point = (self.serve_point + self.food_point + self.price_point + self.space_point) / 4
        super().save(*args, **kwargs)
