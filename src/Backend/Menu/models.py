from django.db import models
from django.core.validators import MinValueValidator

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    name = models.CharField(max_length=255)
    price = models.IntegerField(
        validators=[MinValueValidator(0)]  
    )
    description = models.TextField()
    image = models.ImageField(upload_to='assets/menu_img/')
    category = models.ForeignKey(Category, related_name='menu_items', on_delete=models.PROTECT)

    def __str__(self):
        return self.name