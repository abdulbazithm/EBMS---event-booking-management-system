from rest_framework import permissions

class IsOrganizerOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow only organizers or admins.
    """

    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and (user.is_organizer() or user.is_admin())
