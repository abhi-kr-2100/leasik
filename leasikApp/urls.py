from django.urls import path

from .views import (
    SentenceListView, ListDetailView, ListDetailEditView,
    SentenceListDetailView, add_new_word, update_proficiency,
    update_sentence_proficiency
)

app_name = 'leasikApp'
urlpatterns = [
    path('', SentenceListView.as_view(), name='home'),
    path('update_proficiency', update_sentence_proficiency,
        name='update-proficiency'),
    path('<slug:slug>', SentenceListDetailView.as_view(), name='list-detail'),
    path('<slug:slug>/edit', ListDetailEditView.as_view(), name='list-edit'),
    path('<slug:slug>/edit/add-new-word', add_new_word, name='add-new-word'),
]
