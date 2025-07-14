from django.contrib import admin
from .models import WelcomeMessage, About, Skill, Achievement, Experience, Contact

admin.site.register(WelcomeMessage)
admin.site.register(About)
admin.site.register(Skill)
admin.site.register(Achievement)
admin.site.register(Experience)
admin.site.register(Contact)