from django.contrib import admin

from .models import UserProfile, Sentence, List, SentenceProficiency


admin.site.register(Sentence)
admin.site.register(UserProfile)
admin.site.register(List)
admin.site.register(SentenceProficiency)
