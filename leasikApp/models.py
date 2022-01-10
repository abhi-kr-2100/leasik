from __future__ import annotations

from django.db import models
from django.db.models.signals import post_save
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from django.dispatch import receiver


class Sentence(models.Model):
    text = models.TextField()
    translation = models.TextField()

    class Meta:
        unique_together = ('text', 'translation')

    def __str__(self) -> str:
        return f'{self.text} ({self.translation})'


class List(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)

    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    sentences = models.ManyToManyField(Sentence, blank=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        unique_together = ('slug', 'owner')


class Proficiency(models.Model):
    """How proficient is a user with a given sentence?"""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sentence = models.ForeignKey(
        Sentence, on_delete=models.CASCADE)

    proficiency = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )

    def __str__(self) -> str:
        return f'{self.user.id}: {self.sentence.text} - {self.proficiency}%'

    def __lt__(self, other: Proficiency) -> bool:
        return self.proficiency < other.proficiency

    class Meta:
        unique_together = ('user', 'sentence')
        verbose_name_plural = 'proficiencies'


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    questions_per_page = models.IntegerField(
        validators=[MinValueValidator(5), MaxValueValidator(50)], default=25)

    def __str__(self) -> str:
        return self.user.username

    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            UserProfile.objects.create(user=instance)
