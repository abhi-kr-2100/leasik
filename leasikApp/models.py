from __future__ import annotations
from typing import Any
from random import choice

from django.db import models
from django.db.models.signals import post_save
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from django.dispatch import receiver


class Sentence(models.Model):
    """A sentence with a text and translation."""

    text = models.TextField()
    translation = models.TextField()

    class Meta:
        unique_together = ('text', 'translation')

    def __str__(self) -> str:
        return f'{self.text} ({self.translation})'


class SentenceNote(models.Model):
    """Additional notes for a sentence."""

    note = models.TextField(default='')
    sentence = models.ForeignKey(Sentence, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('sentence', 'owner')

    def __str__(self) -> str:
        return self.note


class SentenceList(models.Model):
    """A list of sentences owned by a user."""
    
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)

    description = models.TextField(blank=True)

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=True)

    sentences = models.ManyToManyField(Sentence, blank=True)

    def __str__(self) -> str:
        return self.name


class Proficiency(models.Model):
    """How proficient is a user with a given sentence?"""

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    sentence = models.ForeignKey(Sentence, on_delete=models.CASCADE)

    proficiency = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )

    def __str__(self) -> str:
        return f'{self.owner.id}: {self.sentence.text} - {self.proficiency}%'

    def __lt__(self, other: Proficiency) -> bool:
        if self.proficiency == other.proficiency:
            # for extra randomization
            return choice([True, False])
            
        return self.proficiency < other.proficiency

    class Meta:
        unique_together = ('owner', 'sentence')
        verbose_name_plural = 'proficiencies'


class UserProfile(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.owner.username

    @receiver(post_save, sender=User)
    def create_user_profile(sender: UserProfile, instance: User, created: bool,
            **kwargs: Any) -> None:
        if created:
            UserProfile.objects.create(owner=instance)
