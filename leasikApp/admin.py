from django.contrib import admin

from .models import UserProfile, Sentence, SentenceList, SentenceProficiency


admin.site.register(Sentence)
admin.site.register(UserProfile)
admin.site.register(SentenceList)
admin.site.register(SentenceProficiency)
