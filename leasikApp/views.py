from django.views.generic.list import ListView
from django.views.generic.detail import DetailView

from .models import List, Proficiency, Sentence
from .helpers import get_proficiency_dict, get_sentence_dict


class WordListView(ListView):
    model = List

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return List.objects.filter(owner=self.request.user)
        return List.objects.none()


class ListDetailView(DetailView):
    model = List

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return List.objects.filter(owner=self.request.user)
        return List.objects.none()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        words = context['object'].words.all()

        proficiency_dict = get_proficiency_dict(
            self.request.user, words, Proficiency)
        context['proficiencies'] = proficiency_dict

        sentence_dict = get_sentence_dict(proficiency_dict.keys())
        context['sentences'] = sentence_dict

        return context
