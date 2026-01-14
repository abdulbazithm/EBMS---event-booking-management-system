from django.urls import path
from .views import (
    EventListView,
    EventDetailView,
    EventCreateView,
    EventUpdateView,
    EventDeleteView,
    OrganizerEventListView,
    OrganizerDashboardAPIView,
    OrganizerEventBookingListView,
    CategoryListView
)

urlpatterns = [
    path('', EventListView.as_view(), name='event-list'),
    path('<int:pk>/', EventDetailView.as_view(), name='event-detail'),

    path('categories/', CategoryListView.as_view(), name='category-list'),

    path('create/', EventCreateView.as_view(), name='event-create'),
    path('<int:pk>/update/', EventUpdateView.as_view(), name='event-update'),
    path('<int:pk>/delete/', EventDeleteView.as_view(), name='event-delete'),

    # Phase 1: Organizer-only
    path('organizer/my-events/', OrganizerEventListView.as_view(), name='organizer-events'),

    path('organizer/dashboard/', OrganizerDashboardAPIView.as_view(), name='organizer-dashboard'),

    path('organizer/events/<int:event_id>/bookings/',OrganizerEventBookingListView.as_view(),
        name='organizer-event-bookings'
    ),
]
