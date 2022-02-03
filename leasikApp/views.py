from __future__ import annotations
from typing import Any, Dict, List
from json import loads

from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.decorators import login_required
from django.urls import reverse, reverse_lazy
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView
from django.http import (
    HttpRequest,
    HttpResponse,
    HttpResponseNotAllowed,
    HttpResponseRedirect,
    HttpResponseBadRequest,
    HttpResponseForbidden,
)

from .models import Sentence, SentenceBookmark, SentenceList, Card
from .forms import NewSentenceForm
from .helpers import (
    get_sentence_from_form,
    update_proficiency_helper,
    update_note_helper,
    get_unique_slug,
    get_cards,
)


class ListsView(LoginRequiredMixin, ListView):
    """Display a list of all the lists owned by the current user."""

    model = SentenceList

    def get_template_names(self) -> List[str]:
        return ["leasikApp/sentencelist_list.html"]

    def get_queryset(self: ListsView) -> List[SentenceList]:
        """Return a list of all SentenceLists that can be show to user."""

        user = self.request.user

        qs = set().union(SentenceList.objects.filter(owner=user))
        qs = qs.union(SentenceList.objects.filter(is_public=True))

        return list(qs)


class SentencesListView(LoginRequiredMixin, UserPassesTestMixin, ListView):
    """Allow the user to all sentences in a given list."""

    model = Card

    def test_func(self) -> bool:
        """Test that the user owns the list or that the list is public."""

        user = self.request.user
        slug = self.kwargs["slug"]

        sentence_list: SentenceList = SentenceList.objects.get(slug=slug)
        return sentence_list.is_public or sentence_list.owner == user

    def get_template_names(self) -> List[str]:
        return ["leasikApp/sentence_list.html"]

    def get_queryset(self: SentencesListView) -> List[Card]:
        user = self.request.user
        slug: str = self.kwargs["slug"]

        sentence_list: SentenceList = SentenceList.objects.get(slug=slug)
        sentences = list(sentence_list.sentences.all())
        return get_cards(user, sentences, 20)

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)

        slug = self.kwargs["slug"]
        the_list = SentenceList.objects.get(slug=slug)
        context["list_object"] = the_list

        return context


class BookmarkedSentencesListView(SentencesListView):
    """Play only bookmarked sentences of a list."""

    def get_queryset(self: SentencesListView) -> List[Card]:
        user = self.request.user
        slug: str = self.kwargs["slug"]

        sentence_list: SentenceList = SentenceList.objects.get(slug=slug)
        bookmarks: SentenceBookmark = SentenceBookmark.objects.get_or_create(
            owner=user, sentence_list=sentence_list
        )[0]
        sentences = list(bookmarks.sentences.all())
        return get_cards(user, sentences, 20)


class EditListView(LoginRequiredMixin, UserPassesTestMixin, DetailView):
    """Allow user to add and remove sentences from this list."""

    model = SentenceList

    def test_func(self) -> bool:
        """Test that user has permission to edit this list."""

        object: SentenceList = self.get_object()
        return object.owner == self.request.user

    def get_template_names(self: EditListView) -> List[str]:
        return ["leasikApp/sentencelist_edit.html"]

    def get_context_data(self: EditListView, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context["form"] = NewSentenceForm

        return context


class SentenceListCreateView(LoginRequiredMixin, CreateView):
    model = SentenceList
    fields = ["name", "description"]
    success_url = reverse_lazy("leasikApp:home")

    def form_valid(self, form):
        user = self.request.user
        slug = get_unique_slug(form.instance.name)

        form.instance.owner = user
        form.instance.slug = slug

        return super().form_valid(form)


@login_required
def add_new_sentence(request: HttpRequest, pk: int) -> HttpResponse:
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    form = NewSentenceForm(request.POST)
    this_list: SentenceList = SentenceList.objects.get(pk=pk)
    if this_list.owner != request.user:
        return HttpResponseForbidden()
    if not form.is_valid():
        return HttpResponseBadRequest()

    this_list.sentences.add(get_sentence_from_form(form))

    return HttpResponseRedirect(reverse("leasikApp:list-edit", args=[this_list.slug]))


@login_required
def update_proficiency(request: HttpRequest) -> HttpResponse:
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    request_data = loads(request.body.decode("utf-8"))

    user = request.user
    sentence_id = request_data["id"]
    score = request_data["score"]

    update_proficiency_helper(user, sentence_id, score)

    return HttpResponse(status=200)


@login_required
def update_note(request: HttpRequest) -> HttpResponse:
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    request_data = loads(request.body.decode("utf-8"))

    user = request.user
    sentence_id = request_data["id"]
    new_note = request_data["new_note"]

    update_note_helper(user, sentence_id, new_note)

    return HttpResponse(status=200)


@login_required
def bookmark_sentence(request: HttpRequest) -> HttpResponse:
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    request_data = loads(request.body.decode("utf-8"))

    sentence_id = request_data["sentence_id"]
    list_id = request_data["list_id"]

    the_list: SentenceList = SentenceList.objects.get(pk=list_id)
    the_user = request.user
    the_bookmark_list: SentenceBookmark = SentenceBookmark.objects.get_or_create(
        owner=the_user, sentence_list=the_list
    )[0]
    the_sentence: Sentence = Sentence.objects.get(pk=sentence_id)

    the_bookmark_list.sentences.add(the_sentence)

    return HttpResponse(status=200)
