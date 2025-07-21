from django.db import models

class WelcomeMessage(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200)
    button_text_1 = models.CharField(max_length=50, blank=True, null=True)
    button_link_1 = models.URLField(blank=True, null=True)
    button_text_2 = models.CharField(max_length=50, blank=True, null=True)
    button_link_2 = models.URLField(blank=True, null=True)
    service_item_1 = models.CharField(max_length=100, blank=True, null=True)
    service_item_2 = models.CharField(max_length=100, blank=True, null=True)
    service_item_3 = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.title

class About(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    # image = models.ImageField(upload_to='about/', blank=True, null=True)

    def __str__(self):
        return self.title

class Skill(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Achievement(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.title

class Experience(models.Model):
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField()

    def __str__(self):
        return f"{self.title} at {self.company}"

class Contact(models.Model):
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    formspree_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.email