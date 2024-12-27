from django.core.exceptions import ValidationError
from django.db import models

# Create your models here.
def validate_discount(value):
    if value < 0 or value > 100:
        raise ValidationError('Discount must be between 0 and 100.')

class Promotion(models.Model):
    code=models.CharField(max_length=10, primary_key = True)
    title = models.TextField()
    startdate=models.DateField()
    enddate=models.DateField()
    description = models.TextField()
    image = models.ImageField(upload_to='promotion_img/')
    discount = models.IntegerField(validators=[validate_discount])
    
    def __str__(self):
        return self.title
