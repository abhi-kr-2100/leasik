from django.urls import path

from .views import WordListView, ListDetailView


urlpatterns = [
    path('', WordListView.as_view(), name='home'),
    path('<slug:slug>', ListDetailView.as_view(), name='list-detail')
]
