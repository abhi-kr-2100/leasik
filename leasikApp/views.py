from __future__ import annotations
from typing import Any, Dict, List
from json import loads

from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.generic.list import ListView
from django.http import HttpRequest, HttpResponse

from .models import Sentence, SentenceBookmark, SentenceList, Card
from .helpers import (
    update_proficiency_helper,
    update_note_helper,
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

        bookmarks: SentenceBookmark = SentenceBookmark.objects.get_or_create(
            owner=self.request.user, sentence_list=the_list
        )[0]
        sentences = [c.sentence for c in context["object_list"]]
        bookmarked_sentences = [s for s in bookmarks.sentences.all() if s in sentences]

        cards = context["object_list"]
        cards_with_bookmark_status = zip(
            cards, [(c.sentence in bookmarked_sentences) for c in cards]
        )
        context["object_list"] = cards_with_bookmark_status

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


@login_required
@require_POST
def update_proficiency(request: HttpRequest) -> HttpResponse:
    """Update currently logged-in user's proficiency with a card of Sentence.

    The card is determined using the Sentence and the hidden word position.
    """

    request_data = loads(request.body.decode("utf-8"))

    user = request.user
    sentence_id = request_data["id"]
    hidden_word_position = request_data["hiddenWordPosition"]
    score = request_data["score"]

    update_proficiency_helper(user, sentence_id, hidden_word_position, score)

    return HttpResponse(status=200)


@login_required
@require_POST
def update_note(request: HttpRequest) -> HttpResponse:
    """Update note on a card.

    The card is determined using the Sentence ID and hidden word position.
    """

    request_data = loads(request.body.decode("utf-8"))

    user = request.user
    sentence_id = request_data["id"]
    hidden_word_position = request_data["hiddenWordPosition"]
    new_note = request_data["new_note"]

    update_note_helper(user, sentence_id, hidden_word_position, new_note)

    return HttpResponse(status=200)


@login_required
@require_POST
def bookmark_sentence(request: HttpRequest) -> HttpResponse:
    """Bookmark the given sentence."""

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
