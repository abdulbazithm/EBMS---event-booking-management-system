from django.contrib import admin
from .models import Category, Event


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'organizer',
        'category',
        'event_date',
        'total_seats',
        'booked_seats'
    )
    list_filter = ('category', 'event_date')
    search_fields = ('title', 'location')
