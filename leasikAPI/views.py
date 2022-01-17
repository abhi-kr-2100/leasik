from typing import List

from django.shortcuts import get_object_or_404
from django.db.models import QuerySet

from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from leasikApp.models import Sentence, SentenceList
from leasikApp.helpers import get_unique_slug
from .serializers import SentenceListSerializer, SentenceSerializer
from .permissions import IsOwnerOrReadonlyPublic


class SentenceListViewSet(ModelViewSet):
    serializer_class = SentenceListSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadonlyPublic)

    def get_queryset(self) -> List[SentenceList]:
        qs = set().union(SentenceList.objects.filter(is_public=True))
        qs = qs.union(SentenceList.objects.filter(owner=self.request.user))

        return list(qs)

    def get_object(self):
        obj = get_object_or_404(SentenceList, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)

        return obj

    def perform_create(self, serializer: SentenceListSerializer):
        owner = self.request.user
        slug = get_unique_slug(serializer.validated_data.get('name'))

        serializer.save(owner=owner, slug=slug)


class SentenceViewSet(ModelViewSet):
    serializer_class = SentenceSerializer
    permission_classes = (IsAuthenticated,)

    def _get_parent_list(self) -> SentenceList:
        """Return the parent SentenceList of this Sentence.
        
        Also checks if user has permissions to access the parent SentenceList.
        """

        sentence_list_id = self.kwargs['list_id']
        sentence_list = get_object_or_404(SentenceList, pk=sentence_list_id)

        if not IsOwnerOrReadonlyPublic().has_object_permission(
                self.request, self, sentence_list):
            raise PermissionDenied()

        return sentence_list

    def get_queryset(self) -> QuerySet[Sentence]:
        parent_list: SentenceList = self._get_parent_list()
        return parent_list.sentences.all()

    def get_object(self):
        self._get_parent_list()
        return get_object_or_404(Sentence, pk=self.kwargs['pk'])
        
    def create(self, request, *args, **kwargs):
        """Create a Sentence if it doesn't exist and add it to the parent list.
        
        If Sentence already exists, only add it to the parent list."""

        serializer: SentenceSerializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        parent_list: SentenceList = self._get_parent_list()
        sentence: Sentence = Sentence.objects.get_or_create(
            **serializer.data
        )[0]
        parent_list.sentences.add(sentence)

        headers = self.get_success_headers(serializer.data)
        
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers)
