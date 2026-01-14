from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'event',
        'tickets',
        'status',
        'booking_time'
    )
    list_filter = ('status', 'booking_time')
    search_fields = ('user__username', 'event__title')
