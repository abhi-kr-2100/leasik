from django.contrib import admin

from .models import SentenceList, Sentence, Card


admin.site.register(SentenceList)
admin.site.register(Sentence)
admin.site.register(Card)
