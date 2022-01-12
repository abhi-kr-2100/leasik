from django.urls import path

from .views import (ListsView, EditListView, PlayListView, update_proficiency, 
    add_new_sentence)


app_name = 'leasikApp'
urlpatterns = [
    path('', ListsView.as_view(), name='home'),
    path('update_proficiency', update_proficiency, name='update-proficiency'),
    path('<slug:slug>', PlayListView.as_view(), name='list-detail'),
    path('<slug:slug>/edit', EditListView.as_view(), name='list-edit'),
    path('<int:pk>/edit/add-new-sentence', add_new_sentence,
        name='add-new-sentence')
]
