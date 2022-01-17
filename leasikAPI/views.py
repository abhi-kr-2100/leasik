from typing import List

from django.shortcuts import get_object_or_404

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from leasikApp.models import Sentence, SentenceList
from leasikApp.helpers import get_unique_slug
from .serializers import SentenceListSerializer, SentenceSerializer
from .permissions import IsOwnerOrReadonlyPublic, IsOnlyAddingOrReadonly


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
    queryset = Sentence.objects.all()
    permission_classes = (IsAuthenticated, IsOnlyAddingOrReadonly)
