from django import forms


class NewWordForm(forms.Form):
    language_choices = [
        ('en', 'English'),
        ('tr', 'Türkçe'),
    ]

    word_text = forms.CharField(label='', max_length=50)
    language = forms.ChoiceField(label='', choices=language_choices)
    text = forms.CharField(label='Sentence text')
    translation = forms.CharField(label='English translation')
