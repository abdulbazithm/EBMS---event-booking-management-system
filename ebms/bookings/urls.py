from django.urls import path
from .views import (
    BookingCreateView,
    BookingListView,
    CancelBookingAPIView,
    MyBookingsAPIView,
    OrganizerEventBookingListView
)

urlpatterns = [
    path('', BookingListView.as_view()),
    path('create/', BookingCreateView.as_view()),
    path('bookings/my/', MyBookingsAPIView.as_view(), name='my-bookings'),
    path('bookings/<int:pk>/cancel/', CancelBookingAPIView.as_view(), name='cancel-booking'),

    # Phase 2: Organizer view
    path(
        'organizer/events/<int:event_id>/bookings/',OrganizerEventBookingListView.as_view(),
        name='organizer-event-bookings'
    ),
]
