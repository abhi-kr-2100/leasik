from django.urls import path

from .views import (
    ListsView, EditListView, SentencesListView, update_proficiency, 
    add_new_sentence, update_note
)


app_name = 'leasikApp'
urlpatterns = [
    path('', ListsView.as_view(), name='home'),

    # post request with an authenticated user and id of sentence will increment
    # the proficiency by 1
    path('update_proficiency', update_proficiency, name='update-proficiency'),

    # post request with an authenticated user and id of sentence along with a
    # new note will replace the old note with the new note
    path('update_note', update_note, name='update-note'),

    path('<slug:slug>', SentencesListView.as_view(), name='list-detail'),
    path('<slug:slug>/edit', EditListView.as_view(), name='list-edit'),
    
    # post request with pk of list and the appropriate form in POST will add
    # a new sentence to the list
    path('<int:pk>/edit/add-new', add_new_sentence, name='add-new-sentence')
]
