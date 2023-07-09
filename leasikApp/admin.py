from django.contrib import admin

from .models import SentenceList, Sentence, WordCard, Tag, UserProfile


admin.site.register(SentenceList)
admin.site.register(Sentence)
admin.site.register(WordCard)
admin.site.register(Tag)
admin.site.register(UserProfile)
