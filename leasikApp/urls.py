from django.urls import path

from .views import (
    WordListView, ListDetailView, ListDetailEditView, add_new_word)

app_name = 'leasikApp'
urlpatterns = [
    path('', WordListView.as_view(), name='home'),
    path('<slug:slug>', ListDetailView.as_view(), name='list-detail'),
    path('<slug:slug>/edit', ListDetailEditView.as_view(), name='list-edit'),
    path('<slug:slug>/edit/add-new-word', add_new_word, name='add-new-word')
]
