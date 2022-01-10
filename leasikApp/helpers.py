"""Helper or utility functions for the leasikApp app."""


from collections import OrderedDict


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


def add_sentence_to_list(user, slug, form, Sentence, List):
    """Add the sentence in form to a list with the given slug owned by user."""

    the_list = List.objects.get(owner=user, slug=slug)
    the_sentence = Sentence.objects.get_or_create(
        text=form.cleaned_data['text'],
        translation=form.cleaned_data['translation']
    )[0]

    the_list.sentences.add(the_sentence)
