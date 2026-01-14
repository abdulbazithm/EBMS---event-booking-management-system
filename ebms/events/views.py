from rest_framework import generics, permissions, filters
from .models import Event
from .serializers import EventSerializer

from accounts.permissions import IsOrganizerOrAdmin
from rest_framework.permissions import IsAuthenticated 


from rest_framework.views import APIView
from rest_framework.response import Response
from events.models import Event
from bookings.models import Booking

from rest_framework.exceptions import ValidationError

from rest_framework.exceptions import PermissionDenied

from bookings.serializers import OrganizerBookingSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Category
from .serializers import CategorySerializer


class EventListView(generics.ListAPIView):
    queryset = Event.objects.all().order_by('event_date')
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]


class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]




class EventCreateView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, IsOrganizerOrAdmin]

class EventUpdateView(generics.UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, IsOrganizerOrAdmin]

class EventDeleteView(generics.DestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, IsOrganizerOrAdmin]


class OrganizerEventListView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, IsOrganizerOrAdmin]

    def get_queryset(self):
        user = self.request.user

        # Admin sees all events
        if user.is_staff:
            return Event.objects.all().order_by('event_date')

        # Organizer sees only their events
        return Event.objects.filter(organizer=user).order_by('event_date')


class OrganizerDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated, IsOrganizerOrAdmin]

    def get(self, request):
        user = request.user

        # Get events for this organizer
        if user.is_admin():
            events = Event.objects.all()
        else:
            events = Event.objects.filter(organizer=user)

        data = []
        for event in events:
            total_bookings = Booking.objects.filter(event=event, status='BOOKED').count()
            cancelled_bookings = Booking.objects.filter(event=event, status='CANCELLED').count()
            active_bookings = total_bookings
            seats_filled = event.booked_seats
            total_seats = event.total_seats

            data.append({
                'event_id': event.id,
                'title': event.title,
                'total_bookings': total_bookings + cancelled_bookings,
                'active_bookings': active_bookings,
                'cancelled_bookings': cancelled_bookings,
                'seats_filled': seats_filled,
                'total_seats': total_seats
            })

        return Response(data)
    



class EventDeleteView(generics.DestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, IsOrganizerOrAdmin]

    def perform_destroy(self, instance):
        has_active_bookings = instance.bookings.filter(status='BOOKED').exists()

        if has_active_bookings:
            raise ValidationError(
                "Cannot delete an event with active bookings."
            )

        instance.delete()



def check_event_permission(user, event):
    """
    Raise an exception if user is not allowed to access this event's bookings.
    """
    if not user.is_admin() and event.organizer != user:
        raise PermissionDenied("Access denied.")


class OrganizerEventBookingListView(generics.ListAPIView):
    serializer_class = OrganizerBookingSerializer
    permission_classes = [IsAuthenticated, IsOrganizerOrAdmin]

    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['booking_time', 'tickets']
    ordering = ['-booking_time']

    def get_queryset(self):
        event_id = self.kwargs['event_id']
        user = self.request.user

        event = get_object_or_404(Event, id=event_id)
        check_event_permission(user, event)

        # ✅ IMPORTANT: select_related
        queryset = Booking.objects.select_related('user').filter(
            event=event
        )

        # Status filter
        status_param = self.request.query_params.get('status')
        if status_param in [Booking.BOOKED, Booking.CANCELLED]:
            queryset = queryset.filter(status=status_param)

        # Search filter
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(user__username__icontains=search) |
                Q(user__email__icontains=search)
            )

        return queryset.order_by('-booking_time')

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]