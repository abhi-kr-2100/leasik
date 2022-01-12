from json import loads

from django.urls import reverse
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.http import (
    HttpResponse, HttpResponseNotAllowed, HttpResponseRedirect,
    HttpResponseBadRequest, HttpResponseForbidden
)

from .models import List
from .forms import NewSentenceForm
from .helpers import (
    get_proficiency_dict, add_sentence_to_list, update_each_proficiency
)


class ListsView(ListView):
    """Display a list of all the lists owned by the current user."""

    model = List

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return List.objects.filter(owner=self.request.user)
        return List.objects.none()


class PlayListView(DetailView):
    """Allow the user to play this list."""

    model = List

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return List.objects.filter(owner=self.request.user)
        return List.objects.none()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        sentences = context['object'].sentences.all()

        proficiency_dict = get_proficiency_dict(self.request.user, sentences)
        context['proficiencies'] = proficiency_dict

        return context


class EditListView(DetailView):
    """Allow user to add and remove sentences from this list."""

    model = List

    def get_template_names(self):
        return ['leasikApp/list_edit.html']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return List.objects.filter(owner=self.request.user)
        return List.objects.none()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = NewSentenceForm

        return context


def add_new_sentence(request, slug):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    elif not request.user.is_authenticated:
        return HttpResponseForbidden()


    form = NewSentenceForm(request.POST)
    if form.is_valid():
        add_sentence_to_list(request.user, slug, form)
    else:
        return HttpResponseBadRequest()

    return HttpResponseRedirect(reverse('leasikApp:list-edit', args=[slug]))


def update_proficiency(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    elif not request.user.is_authenticated:
        return HttpResponseForbidden()

    request_data = loads(request.body.decode('utf-8'))

    user = request.user
    data_items = request_data['data']

    update_each_proficiency(user, data_items)

    return HttpResponse(status=200)
