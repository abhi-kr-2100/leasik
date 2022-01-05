from django.views.generic.list import ListView
from django.views.generic.detail import DetailView

from .models import List, Proficiency


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
        proficiencies = Proficiency.objects.filter(
            user=self.request.user,
            word__in=words
        )

        proficiency_dict = {
            p.word: p.proficiency for p in proficiencies
        }

        context['proficiencies'] = proficiency_dict

        return context
