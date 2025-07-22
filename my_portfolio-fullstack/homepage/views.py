from django.shortcuts import render
from django.http import HttpResponse
from .models import WelcomeMessage, About, Skill, Achievement, Experience, Contact

def home(request):
    welcome_message = WelcomeMessage.objects.first()
    about = About.objects.first()
    skills = Skill.objects.all()
    achievements = Achievement.objects.all()
    experiences = Experience.objects.all().order_by('-start_date')
    contact = Contact.objects.first()

    context = {
        'welcome_message': welcome_message,
        'about': about,
        'skills': skills,
        'achievements': achievements,
        'experiences': experiences,
        'contact': contact,
    }
    return render(request, 'homepage/index.html', context)

def health_check(request):
    return HttpResponse("OK", status=200)
