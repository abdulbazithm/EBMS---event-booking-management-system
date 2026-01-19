from rest_framework import serializers
from django.db import transaction
from django.utils import timezone
from datetime import datetime

from .models import Booking
from events.models import Event


class BookingSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(
        source="event.title",
        read_only=True
    )

    class Meta:
        model = Booking
        fields = [
            'id',
            'event',
            'event_title',
            'tickets',
            'status',
            'booking_time'
        ]
        read_only_fields = ['status', 'booking_time']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        event = data['event']
        tickets = data['tickets']

        event_datetime = timezone.make_aware(
            datetime.combine(event.event_date, event.event_time)
        )
        if event_datetime < timezone.now():
            raise serializers.ValidationError({
                "non_field_errors": [
                    "This event has already ended and cannot be booked."
                ]
            })

        if Booking.objects.filter(
            user=user,
            event=event,
            status=Booking.BOOKED
        ).exists():
            raise serializers.ValidationError({
                "non_field_errors": [
                    "You have already booked this event."
                ]
            })

        if event.booked_seats + tickets > event.total_seats:
            raise serializers.ValidationError({
                "non_field_errors": [
                    "Not enough seats available."
                ]
            })

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        event = validated_data['event']
        tickets = validated_data['tickets']

        with transaction.atomic():
            event.refresh_from_db()

            event_datetime = timezone.make_aware(datetime.combine(event.event_date, event.event_time))
            if event_datetime < timezone.now():
                raise serializers.ValidationError({
                    "non_field_errors": [
                        "This event has already ended and cannot be booked."
                    ]
                })

            if event.booked_seats + tickets > event.total_seats:
                raise serializers.ValidationError({
                    "non_field_errors": [
                        "Not enough seats available."
                    ]
                })

            event.booked_seats += tickets
            event.save()

            booking = Booking.objects.create(
                user=user,
                event=event,
                tickets=tickets,
                status=Booking.BOOKED
            )

        return booking


class OrganizerBookingSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id',
            'user',
            'tickets',
            'status',
            'booking_time'
        ]

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "username": obj.user.username,
            "email": obj.user.email
        }
