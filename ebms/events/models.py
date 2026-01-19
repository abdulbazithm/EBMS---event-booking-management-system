from django.conf import settings
from django.db import models
from django.utils.text import slugify

from django.utils import timezone
from datetime import datetime

from django.core.exceptions import ValidationError


User = settings.AUTH_USER_MODEL


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Event(models.Model):
    organizer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='events'
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='events'
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=255)

    event_date = models.DateField()
    event_time = models.TimeField()

    total_seats = models.PositiveIntegerField()
    booked_seats = models.PositiveIntegerField(default=0)

    image = models.ImageField(upload_to='events/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def available_seats(self):
        return self.total_seats - self.booked_seats

    def is_sold_out(self):
        return self.available_seats() <= 0

    def is_past_event(self):
        event_datetime = datetime.combine(self.event_date, self.event_time)
        return event_datetime < timezone.now()

    def clean(self):
        if self.booked_seats > self.total_seats:
            raise ValidationError("Booked seats cannot exceed total seats.")

    def __str__(self):
        return self.title

