"""Helper or utility functions for the leasikApp app."""


from collections import OrderedDict
from re import compile
from random import randint, choice
from json import loads

from requests import get
from bs4 import BeautifulSoup


def clean_data(raw_data):
    """Clean the given data so it is valid JSON."""

    start_index = 0
    while raw_data[start_index] != '{':
        start_index += 1

    cleaned_data = ''
    nesting = 0
    for ch in raw_data[start_index:]:
        cleaned_data += ch
        
        if ch == '{':
            nesting += 1
        elif ch == '}':
            nesting -= 1

        if nesting == 0:
            return cleaned_data

    return '{ "error": "Failed!" }'


def load_tatoeba_json_data(id):
    """Return the JSON data for the Tatoeba sentence associated with the ID."""

    SELECTOR = 'div.sentence-and-translations.md-whiteframe-1dp'

    url = f'https://tatoeba.org/en/sentences/show/{id}'
    page = get(url)
    parser = BeautifulSoup(page.content, 'html.parser')

    try:
        # We've a dynamic page but the data is available inside the ng-init
        # attribute. Unfortunately, there's a bit of junk around it that we need 
        # to get rid of.
        raw_data = parser.select_one(SELECTOR)['ng-init']
    except TypeError:   # page doesn't exist
        raise KeyError("Given ID doesn't correspond to a sentence.")

    json_data = loads(clean_data(raw_data))

    return json_data


def get_page_url_for_word(word):
    """Return a URL where sentences with the given word can be found."""

    base_url = f'https://tatoeba.org/en/sentences/search?query={word}'
    page = get(base_url)
    parser = BeautifulSoup(page.content, 'html.parser')

    list_of_page_links = parser.find_all('a', string=compile(r'^[1-9]\d*$'))
    max_page_num = 1
    for pl in list_of_page_links:
        if int(pl.text) > max_page_num:
            max_page_num = int(pl.text)

    target_page_num = randint(1, max_page_num)
    target_url = base_url + f'&page={target_page_num}'

    return target_url


def get_sentence_id_for_word(word):
    """Return a Tatoeba sentence ID associated with the given word."""

    SELECTOR = 'sentence-and-translations'

    url = get_page_url_for_word(word)
    page = get(url)
    parser = BeautifulSoup(page.content, 'html.parser')

    sentence_element = choice(parser.find_all('div', { SELECTOR: True }))
    raw_data = sentence_element['ng-init']
    json_data = loads(clean_data(raw_data))

    return json_data['id']


def get_sentence_text(id):
    """Return the Tatoeba sentence text associated with the given id."""

    json_data = load_tatoeba_json_data(id)

    try:
        text = json_data['text']
    except KeyError:    # clean_data failed; probably sentence page is bad
        raise KeyError("Given ID doesn't correspond to a valid sentence page.")

    return text


def get_english_translation(id):
    """Return the English translation of the Tatoeba sentence associated with
    the given ID.
    """

    json_data = load_tatoeba_json_data(id)

    try:
        translation = json_data["base"]["text"]
    except KeyError:
        raise KeyError("Given ID doesn't correspond to a valid sentence page.")

    return translation


def get_or_create_proficiencies(user, words, proficiency_model):
    """Return a list of Proficiency for given words of a given user.
    
    If a Proficiency doesn't, create it.
    """

    proficiencies = []
    for w in words:
        proficiencies.append(
            proficiency_model.objects.get_or_create(user=user, word=w)[0])

    return proficiencies


def get_or_create_sentence_proficiencies(user, sentences, proficiency_model):
    """Return a list of Proficiency for given words of a given user.
    
    If a Proficiency doesn't, create it.
    """

    proficiencies = []
    for s in sentences:
        proficiencies.append(
            proficiency_model.objects.get_or_create(user=user, sentence=s)[0])

    return proficiencies


def get_sentence_proficiency_dict(user, sentences, proficiency_model):
    """Return an OrderedDict of sentence to proficiency mapping.
    
    The dictionary is ordered by proficiency. The considered sentences are
    passed in through the parameters and are assumed to belong to the given
    user.
    """

    proficiencies = sorted(
        get_or_create_sentence_proficiencies(user, sentences, proficiency_model)
    )

    proficiency_dict = OrderedDict()
    for p in proficiencies:
        proficiency_dict[p.sentence] = p.proficiency

    return proficiency_dict


def get_proficiency_dict(user, words, proficiency_model):
    """Return an OrderedDict of word to proficiency mapping.
    
    The dictionary is ordered by proficiency. The considered words are passed
    in through the parameters and are assumed to belong to the given user.
    """

    proficiencies = sorted(
        get_or_create_proficiencies(user, words, proficiency_model))

    proficiency_dict = OrderedDict()
    for p in proficiencies:
        proficiency_dict[p.word] = p.proficiency

    return proficiency_dict


def get_sentence_dict(words):
    """Return an OrderedDict of word to sentence mapping."""

    sentences_dict = OrderedDict()
    for w in words:
        sentences_dict[w] = w.sentences.all().order_by('?').first()

    return sentences_dict


def add_word_to_list(user, slug, form, Word, List, Sentence):
    """Add the word inside form to a list with the given slug owned by user."""

    the_list = List.objects.get(owner=user, slug=slug)
    the_word = Word.objects.get_or_create(
        word_text=form.cleaned_data['word_text'],
        language=form.cleaned_data['language']
    )[0]

    new_sentence = Sentence.objects.get_or_create(
        text=form.cleaned_data['text'],
        english_translation=form.cleaned_data['translation']
    )[0]

    the_word.sentences.add(new_sentence)
    the_list.words.add(the_word)


def add_sentence_to_list(user, slug, form, Sentence, List):
    """Add the sentence in form to a list with the given slug owned by user."""

    the_list = List.objects.get(owner=user, slug=slug)
    the_sentence = Sentence.objects.get_or_create(
        text=form.cleaned_data['text'],
        english_translation=form.cleaned_data['translation']
    )[0]

    the_list.sentences.add(the_sentence)
