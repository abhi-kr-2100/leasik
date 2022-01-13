from __future__ import annotations
from typing import Any, Dict, List, Union
from json import loads

from django.db.models.query import QuerySet
from django.urls import reverse
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.http import (
    HttpRequest, HttpResponse, HttpResponseNotAllowed, HttpResponseRedirect,
    HttpResponseBadRequest, HttpResponseForbidden
)

from .models import Sentence, SentenceList
from .forms import NewSentenceForm
from .helpers import (
    get_sentence_from_form, update_proficiency_helper, get_sentences_in_order,
    get_notes_for_sentences
)


class ListsView(ListView):
    """Display a list of all the lists owned by the current user."""

    model = SentenceList

    def get_queryset(self: ListsView) -> QuerySet[SentenceList]:
        if self.request.user.is_authenticated:
            return SentenceList.objects.filter(owner=self.request.user)
        return SentenceList.objects.none()


class SentencesListView(ListView):
    """Allow the user to all sentences in a given list."""

    model = Sentence
    paginate_by = 10

    def get_template_names(self) -> List[str]:
        return ['leasikApp/sentence_list.html']

    def get_queryset(self: SentencesListView) -> \
            Union[List[Sentence], QuerySet[Sentence]]:
        if not self.request.user.is_authenticated:
            return Sentence.objects.none()

        user = self.request.user
        slug: str = self.kwargs['slug']
        sentence_list: SentenceList = SentenceList.objects.get(
            owner=user, slug=slug)

        return get_sentences_in_order(user, sentence_list.sentences.all())

    def get_context_data(self: SentencesListView, **kwargs: Any) -> \
            Dict[str, Any]:
        """Return context that contains sentences and associated notes."""

        context = super().get_context_data(**kwargs)

        sentences = context['object_list']
        notes = get_notes_for_sentences(self.request.user, sentences)

        context['object_list'] = zip(sentences, notes)

        return context


class EditListView(DetailView):
    """Allow user to add and remove sentences from this list."""

    model = SentenceList

    def get_template_names(self: EditListView) -> List[str]:
        return ['leasikApp/sentencelist_edit.html']

    def get_queryset(self: EditListView) -> QuerySet[SentenceList]:
        if self.request.user.is_authenticated:
            return SentenceList.objects.filter(owner=self.request.user)
        return SentenceList.objects.none()

    def get_context_data(self: EditListView, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['form'] = NewSentenceForm

        return context


def add_new_sentence(request: HttpRequest, pk: int) -> HttpResponse:
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    elif not request.user.is_authenticated:
        return HttpResponseForbidden()


    form = NewSentenceForm(request.POST)
    this_list = SentenceList.objects.get(pk=pk)
    if form.is_valid():
        this_list.sentences.add(get_sentence_from_form(form))
    else:
        return HttpResponseBadRequest()

    return HttpResponseRedirect(reverse(
        'leasikApp:list-edit', args=[this_list.slug]))


def update_proficiency(request: HttpRequest) -> HttpResponse:
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    elif not request.user.is_authenticated:
        return HttpResponseForbidden()

    request_data = loads(request.body.decode('utf-8'))

    user = request.user
    sentence_id = request_data['id']

    update_proficiency_helper(user, sentence_id)

    return HttpResponse(status=200)
