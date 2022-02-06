from rest_framework.permissions import BasePermission, SAFE_METHODS


class OwnerOnly(BasePermission):
    """Allow only owner to access the object.

    Assumes model has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class OwnerOrPublicReadOnly(BasePermission):
    """Allow read-only access to public objects while reserving full access for owners.

    Assumes model has an `owner` attribute and an `is_public` attribute.
    """

    def has_object_permission(self, request, view, obj):
        if obj.is_public and request.method in SAFE_METHODS:
            return True

        return obj.owner == request.user
