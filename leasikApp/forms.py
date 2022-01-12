from django import forms


class NewSentenceForm(forms.Form):
    text = forms.CharField(label='Text', widget=forms.Textarea)
    translation = forms.CharField(label='Translation', widget=forms.Textarea)

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

        self.fields['text'].widget.attrs.update({'autofocus': 'autofocus'})
