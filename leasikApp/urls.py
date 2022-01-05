from django.urls import path

from .views import WordListView, ListDetailView

app_name = 'leasikApp'
urlpatterns = [
    path('', WordListView.as_view(), name='home'),
    path('<slug:slug>', ListDetailView.as_view(), name='list-detail')
]
