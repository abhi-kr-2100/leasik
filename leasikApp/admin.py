from django.contrib import admin

from .models import Sentence, Tag, Word, WordScore, Book


admin.site.register(WordScore)
admin.site.register(Word)
admin.site.register(Book)
admin.site.register(Sentence)
admin.site.register(Tag)
