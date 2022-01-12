from __future__ import annotations
from typing import Any

from django import forms


class NewSentenceForm(forms.Form):
    text = forms.CharField(label='Text', widget=forms.Textarea)
    translation = forms.CharField(label='Translation', widget=forms.Textarea)

    def __init__(self: NewSentenceForm, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)

        self.fields['text'].widget.attrs.update({'autofocus': 'autofocus'})
