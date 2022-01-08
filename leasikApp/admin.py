from django.contrib import admin

from .models import Word, List, Proficiency, UserProfile, SelfContainedSentence


admin.site.register(SelfContainedSentence)
admin.site.register(Word)
admin.site.register(List)
admin.site.register(Proficiency)
admin.site.register(UserProfile)
