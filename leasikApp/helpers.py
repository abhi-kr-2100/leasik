"""Helper or utility functions for the leasikApp app."""


from collections import OrderedDict
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
