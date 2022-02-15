from django.db.models import Q
from rest_framework.filters import BaseFilterBackend


class IsOwnerFilter(BaseFilterBackend):
    """Only allow users to see objects they own.

    Assumes the model has an `owner` attribute.
    """

    def filter_queryset(self, request, queryset, view):
        if not request.user.is_authenticated:
            return queryset.none()
        return queryset.filter(owner=request.user)


class IsOwnerOrPublicFilter(BaseFilterBackend):
    """Only allow users to see public objects and the objects they own.

    Assumes the model has an `owner` attribute and an `is_public` attribute.
    """

    def filter_queryset(self, request, queryset, view):
        if not request.user.is_authenticated:
            return queryset.filter(is_public=True)
        return queryset.filter(Q(owner=request.user) | Q(is_public=True))


class SentenceListFilter(BaseFilterBackend):
    """Display if object has `sentence_list__id` equal to query parameter.
    
    The query parameter is passed as `sentence_list`.
    """

    def filter_queryset(self, request, queryset, view):
        sentence_list_id = request.query_params.get('sentence_list')
        if sentence_list_id is not None:
            return queryset.filter(sentence_list__id=sentence_list_id)
        return queryset
