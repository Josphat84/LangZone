from django.db import models

# Adding a model to represent a page

class Page(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()

    def __str__(self):
        return self.title

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

   
    def __str__(self):
        return self.name

# Tutor model to represent a tutor

class Tutor(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField()
    age = models.IntegerField()
    languages = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    online = models.BooleanField(default=False)
