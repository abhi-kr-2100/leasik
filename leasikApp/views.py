from json import loads

from django.urls import reverse
from django.http import (
    HttpResponse, HttpResponseNotAllowed, HttpResponseRedirect,
    HttpResponseForbidden
)
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView

from .models import Sentence, List, Proficiency
from .forms import NewSentenceForm
from .helpers import get_proficiency_dict, add_sentence_to_list


class SentenceListView(ListView):
    model = List

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return List.objects.filter(owner=self.request.user)
        return List.objects.none()


class SentenceListDetailView(DetailView):
    model = List

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return List.objects.filter(owner=self.request.user)
        return List.objects.none()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        sentences = context['object'].sentences.all()

        proficiency_dict = get_proficiency_dict(
            self.request.user, sentences, Proficiency)
        context['proficiencies'] = proficiency_dict

        return context


class SentenceListDetailEditView(DetailView):
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
    if request.method == 'POST' and request.user.is_authenticated:
        form = NewSentenceForm(request.POST)
        if form.is_valid():
            add_sentence_to_list(
                request.user, slug, form, Sentence, List)
        else:
            print("Invalid form")
            print(request.POST)

        redirect_url = f'{reverse("leasikApp:list-edit", args=[slug])}'
        return HttpResponseRedirect(redirect_url)

    # TODO: Display form on GET request
    return HttpResponseRedirect(reverse('leasikApp:home'))


def update_sentence_proficiency(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    if not request.user.is_authenticated:
        return HttpResponseForbidden()

    request_data = loads(request.body.decode('utf-8'))

    user = request.user
    data_items = request_data['data']

    for item in data_items:
        sentence = Sentence.objects.get(
            text=item['text'], translation=item['translation'])
        to_update = Proficiency.objects.get(
            user=user, sentence=sentence)

        new_proficiency = (to_update.proficiency + 1) % 100
        to_update.proficiency = new_proficiency
        to_update.save(update_fields=['proficiency'])

    return HttpResponse(status=200)
