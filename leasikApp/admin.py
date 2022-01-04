from django.contrib import admin

from .models import Sentence, Word, List


class SentenceAdmin(admin.ModelAdmin):
    """Don't allow a created Sentence to be changed."""

    def get_readonly_fields(self, request, obj=None):
        if obj: # we're editing a created object
            return self.readonly_fields + ('sentence_id',)
        return self.readonly_fields

admin.site.register(Sentence, SentenceAdmin)


admin.site.register(Word)
admin.site.register(List)
