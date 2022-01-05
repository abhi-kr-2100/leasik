from django.urls import reverse
from django.http.response import HttpResponseRedirect
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView

from .models import List, Proficiency, Sentence, Word
from .forms import NewWordForm
from .helpers import get_proficiency_dict, get_sentence_dict, add_word_to_list


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
    if request.method == 'POST' and request.user.is_authenticated:
        form = NewWordForm(request.POST)
        if form.is_valid():
            add_word_to_list(request.user, slug, form, Word, List, Sentence)

        return HttpResponseRedirect(reverse('leasikApp:list-edit', args=[slug]))

    # TODO: Display form on GET request    
    return HttpResponseRedirect(reverse('leasikApp:home'))
