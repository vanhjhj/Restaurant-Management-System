from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Menu(models.Model):
    name = models.CharField(max_length=255)
    price = models.FloatField()
    description = models.TextField()
    image = models.ImageField(upload_to='menu_img/')
    category = models.ForeignKey(Category, related_name='menu_items', on_delete=models.CASCADE)

    def __str__(self):
        return self.name