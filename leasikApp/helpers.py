"""Helper or utility functions for the leasikApp app."""


from collections import OrderedDict

from .models import Proficiency, Sentence, List


def get_or_create_proficiencies(user, sentences):
    """Get or created (if nonexistent) Proficiency relationships.
    
    Return all the Proficiencies that relate sentences with the given user.
    """

    proficiencies = []
    for s in sentences:
        p = Proficiency.objects.get_or_create(user=user, sentence=s)[0]
        proficiencies.append(p)

    return proficiencies


def get_proficiency_dict(user, sentences):
    """Return an OrderedDict where each sentence is mapped to a proficiency.

    The key is a sentence and the value is the proficiency of the Proficiency
    relationship that exists (or is created) between that sentence and the given
    user.
    """

    proficiencies = sorted(get_or_create_proficiencies(user, sentences))

    proficiency_dict = OrderedDict()
    for p in proficiencies:
        proficiency_dict[p.sentence] = p.proficiency

    return proficiency_dict


def add_sentence_to_list(owner, slug, form):
    """Add the sentence in form to the list with the given slug and owner."""

    the_list = List.objects.get(owner=owner, slug=slug)
    the_sentence = Sentence.objects.get_or_create(
        text=form.cleaned_data['text'],
        translation=form.cleaned_data['translation']
    )[0]

    the_list.sentences.add(the_sentence)


def update_each_proficiency(user, data_items):
    """Update the proficiency of user with each sentence in data_items."""

    for item in data_items:
        sentence = Sentence.objects.get(
            text=item['text'], translation=item['translation'])
        to_update = Proficiency.objects.get(
            user=user, sentence=sentence)

        new_proficiency = (to_update.proficiency + 1) % 100
        to_update.proficiency = new_proficiency
        to_update.save(update_fields=['proficiency'])
