# pages/models.py


from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

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

class Tutor(models.Model):
    EXPERTISE_CHOICES = [
        ('Community Instructor', 'Community Instructor'),
        ('Native Speaker', 'Native Speaker'),
        ('Certified Educator', 'Certified Educator'),
        ('Language Specialist', 'Language Specialist'),
        ('ESL Specialist', 'ESL Specialist'),
    ]
    
    LANGUAGE_CHOICES = [
        ('English', 'English'),
        ('Spanish', 'Spanish'),
        ('French', 'French'),
        ('German', 'German'),
        ('Japanese', 'Japanese'),
        ('Korean', 'Korean'),
        ('Mandarin', 'Mandarin Chinese'),
        ('Arabic', 'Arabic'),
        ('Russian', 'Russian'),
        ('Italian', 'Italian'),
        ('Portuguese', 'Portuguese'),
        ('Hindi', 'Hindi'),
        ('Swedish', 'Swedish'),
    ]
    
    COUNTRY_CHOICES = [
        ('USA', 'USA'),
        ('Spain', 'Spain'),
        ('France', 'France'),
        ('Germany', 'Germany'),
        ('Japan', 'Japan'),
        ('South Korea', 'South Korea'),
        ('China', 'China'),
        ('Egypt', 'Egypt'),
        ('Russia', 'Russia'),
        ('Italy', 'Italy'),
        ('Portugal', 'Portugal'),
        ('India', 'India'),
        ('United Kingdom', 'United Kingdom'),
        ('Canada', 'Canada'),
        ('Australia', 'Australia'),
        ('Mexico', 'Mexico'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='tutor_profile', null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    language = models.CharField(max_length=100, choices=LANGUAGE_CHOICES)
    expertise = models.CharField(max_length=50, choices=EXPERTISE_CHOICES, default='Community Instructor')
    price = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField()
    country = models.CharField(max_length=100, choices=COUNTRY_CHOICES)
    is_native = models.BooleanField(default=False)
    image = models.ImageField(upload_to='tutor_images/', null=True, blank=True)
    online = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.language} Tutor"