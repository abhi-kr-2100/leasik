from django.views.generic.list import ListView

from .models import List


class WordListView(ListView):
    model = List

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return List.objects.filter(owner=self.request.user)
        return List.objects.none()
