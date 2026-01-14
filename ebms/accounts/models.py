from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model for EBMS
    Supports:
    - JWT authentication
    - Role-based access (User / Organizer / Admin)
    - Organizer request + admin approval
    """

    USER = 'USER'
    ORGANIZER = 'ORGANIZER'
    ADMIN = 'ADMIN'

    ROLE_CHOICES = (
        (USER, 'User'),
        (ORGANIZER, 'Organizer'),
        (ADMIN, 'Admin'),
    )

    # Email must be unique for JWT / future social auth
    email = models.EmailField(unique=True)

    # Role is ADMIN-controlled (not user-selected)
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=USER
    )

    # 🔐 NEW: Organizer request flag (approval pending)
    organizer_requested = models.BooleanField(default=False)

    # Optional future use (email verification / social auth)
    is_email_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ===== Role helper methods =====

    def is_organizer(self):
        """
        Organizer access is granted ONLY if role == ORGANIZER
        """
        return self.role == self.ORGANIZER

    def is_admin(self):
        """
        Admin includes Django superuser
        """
        return self.role == self.ADMIN or self.is_superuser

    def __str__(self):
        return f"{self.username} ({self.role})"
