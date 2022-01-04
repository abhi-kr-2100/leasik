"""Helper or utility functions for the leasikApp app."""


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


def get_sentence_text(id):
    """Return the Tatoeba sentence text associated with the given id."""

    SELECTOR = 'div.sentence-and-translations.md-whiteframe-1dp'

    url = f'https://tatoeba.org/en/sentences/show/{id}'
    page = get(url)
    parser = BeautifulSoup(page.content, 'html.parser')

    # We've a dynamic page but the data is available inside the ng-init
    # attribute. Unfortunately, there's a bit of junk around it that we need to
    # get rid of.
    raw_data = parser.select_one(SELECTOR)['ng-init']
    json_data = loads(clean_data(raw_data))

    return json_data['text']
