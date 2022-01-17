from typing import List

from django.shortcuts import get_object_or_404

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from leasikApp.models import SentenceList
from .serializers import SentenceListSerializer
from .permissions import IsOwnerOrReadonlyPublic


class SentenceListViewSet(ModelViewSet):
    serializer_class = SentenceListSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadonlyPublic)

    def get_queryset(self) -> List[SentenceList]:
        qs = set().union(SentenceList.objects.filter(is_public=True))
        qs = qs.union(SentenceList.objects.filter(owner=self.request.user))

        return list(qs)

    def get_object(self):
        obj = get_object_or_404(SentenceList, slug=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)

        return obj
