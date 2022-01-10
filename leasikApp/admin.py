from django.contrib import admin

from .models import (
    UserProfile, SelfContainedSentence, SentenceList, SentenceProficiency)


admin.site.register(SelfContainedSentence)
admin.site.register(UserProfile)
admin.site.register(SentenceList)
admin.site.register(SentenceProficiency)
