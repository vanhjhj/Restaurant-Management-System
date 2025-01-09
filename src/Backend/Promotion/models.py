from django.core.exceptions import ValidationError
from django.db import models
from Restaurant.custom_storage import MediaStorage

# Create your models here.
def validate_discount(value):
    if value < 0 or value > 100:
        raise ValidationError('Discount must be between 0 and 100.')

class Promotion(models.Model):
    code=models.CharField(max_length=10, primary_key = True)
    title = models.TextField()
    startdate=models.DateField()
    enddate=models.DateField()
    min_order = models.IntegerField() #min order to apply promotion
    description = models.TextField()
    image = models.ImageField(storage=MediaStorage(), upload_to='promotion_img/')
    discount = models.IntegerField(validators=[validate_discount])
    type = models.CharField(max_length=10, choices=[('KMTV', 'Khuyen mai thanh vien'), ('KMT', 'Khuyen mai thuong')])
    
    def __str__(self):
        return self.title
