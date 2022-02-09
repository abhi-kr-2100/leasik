from django.urls import path

from .views import (
    ListsView,
    SentencesListView,
    update_proficiency,
    update_note,
    bookmark_sentence,
    BookmarkedSentencesListView,
)


app_name = "leasikApp"
urlpatterns = [
    path("", ListsView.as_view(), name="home"),
    # post request with an authenticated user and id of sentence will increment
    # the proficiency by 1
    path("update_proficiency", update_proficiency, name="update-proficiency"),
    # post request with an authenticated user and id of sentence along with a
    # new note will replace the old note with the new note
    path("update_note", update_note, name="update-note"),
    # post request with an authenticated user and id of the list along with the
    # id of the sentence will add the sentence to the list's bookmarks
    path("bookmark-sentence", bookmark_sentence, name="bookmark-sentence"),
    path("<slug:slug>", SentencesListView.as_view(), name="list-detail"),
    path(
        "<slug:slug>/bookmarks",
        BookmarkedSentencesListView.as_view(),
        name="list-bookmarks",
    ),
]
