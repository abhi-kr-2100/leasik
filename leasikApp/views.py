from django.views.generic.list import ListView
from django.views.generic.detail import DetailView

from .models import List, Proficiency
from .helpers import get_or_create_proficiencies


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
        proficiencies = get_or_create_proficiencies(
            self.request.user, words, Proficiency)

        proficiency_dict = {
            p.word: p.proficiency for p in proficiencies
        }

        context['proficiencies'] = proficiency_dict

        return context
