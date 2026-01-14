from django.conf import settings
from django.db import models
from django.utils import timezone

User = settings.AUTH_USER_MODEL


class Booking(models.Model):
    BOOKED = 'BOOKED'
    CANCELLED = 'CANCELLED'

    STATUS_CHOICES = (
        (BOOKED, 'Booked'),
        (CANCELLED, 'Cancelled'),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='bookings'
    )

    event = models.ForeignKey(
        'events.Event',
        on_delete=models.CASCADE,
        related_name='bookings'
    )

    tickets = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=BOOKED
    )

    booking_time = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user} → {self.event} ({self.status})"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'event'],
                condition=models.Q(status='BOOKED'),
                name='unique_active_booking_per_event'
            )
        ]
