from django.urls import reverse
from django.http.response import HttpResponseRedirect
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView

from .models import List, Proficiency, Sentence
from .forms import NewWordForm
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


class ListDetailEditView(DetailView):
    model = List

    def get_template_names(self):
        return ['leasikApp/list_edit.html']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return List.objects.filter(owner=self.request.user)
        return List.objects.none()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = NewWordForm

        return context


def add_new_word(request, slug):
    if request.method == 'POST':
        return HttpResponseRedirect(reverse('leasikApp:list-edit', args=[slug]))
    return HttpResponseRedirect(reverse('leasikApp:home'))
