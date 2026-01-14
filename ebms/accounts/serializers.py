from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    """
    Handles user registration.
    Organizer role is NOT assigned here.
    Organizer requests are flagged for admin approval.
    """

    password = serializers.CharField(write_only=True)
    register_as_organizer = serializers.BooleanField(
        write_only=True,
        required=False
    )

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
            "register_as_organizer",
        )

    def create(self, validated_data):
        register_as_organizer = validated_data.pop(
            "register_as_organizer", False
        )

        # Create user with hashed password
        user = User.objects.create_user(**validated_data)

        # Organizer request (NOT approval)
        if register_as_organizer:
            user.organizer_requested = True
            user.save()

        return user
