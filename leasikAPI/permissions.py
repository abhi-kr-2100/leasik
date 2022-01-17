from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsOwnerOrReadonlyPublic(BasePermission):
    """Object-level permission to only allow owners edit access to an object,
    but allow public objects to be read by everyone.

    Assumes the model instance has an `owner` and a `is_public` attribute.
    """

    def has_object_permission(self, request, view, obj):
        is_owner = obj.owner == request.user
        readonly_access = request.method in SAFE_METHODS
        is_public = obj.is_public

        return is_owner or (readonly_access and is_public)
