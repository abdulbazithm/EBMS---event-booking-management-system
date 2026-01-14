from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """
    Admin panel for managing users and organizer approvals
    """

    list_display = (
        'id',
        'username',
        'email',
        'role',
        'organizer_requested',
        'is_staff',
        'is_superuser',
        'is_email_verified',
        'created_at',
    )

    list_filter = (
        'role',
        'organizer_requested',
        'is_staff',
        'is_superuser',
        'is_email_verified',
    )

    search_fields = (
        'username',
        'email',
    )

    ordering = ('-created_at',)

    # Make role editable directly from admin list view
    list_editable = ('role',)

    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ("Account Info", {
            "fields": ("username", "email", "password")
        }),
        ("Roles & Permissions", {
            "fields": (
                "role",
                "organizer_requested",
                "is_staff",
                "is_superuser",
            )
        }),
        ("Verification", {
            "fields": ("is_email_verified",)
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at")
        }),
    )
