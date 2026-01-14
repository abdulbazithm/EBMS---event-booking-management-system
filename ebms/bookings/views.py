from rest_framework import generics, permissions
from .models import Booking
from .serializers import BookingSerializer, OrganizerBookingSerializer

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import transaction

from rest_framework.generics import ListAPIView

from accounts.permissions import IsOrganizerOrAdmin
from events.models import Event
from rest_framework.exceptions import PermissionDenied


class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)


class BookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)
    

class CancelBookingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        booking = get_object_or_404(
            Booking,
            pk=pk,
            user=request.user
        )

        if booking.status == Booking.CANCELLED:
            return Response(
                {"detail": "Booking is already cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            event = booking.event
            event.booked_seats -= booking.tickets
            event.save()

            booking.status = Booking.CANCELLED
            booking.save()

        return Response(
            {"detail": "Booking cancelled successfully."},
            status=status.HTTP_200_OK
        )

class MyBookingsAPIView(ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(
            user=self.request.user
        ).order_by('-booking_time')
    


class OrganizerEventBookingListView(generics.ListAPIView):
    serializer_class = OrganizerBookingSerializer
    permission_classes = [IsAuthenticated, IsOrganizerOrAdmin]

    def get_queryset(self):
        user = self.request.user
        event_id = self.kwargs['event_id']

        # 1️⃣ Ensure event exists
        event = get_object_or_404(Event, id=event_id)

        # 2️⃣ Explicit authorization (NO silent failure)
        if user.is_organizer() and event.organizer != user:
            raise PermissionDenied(
                "You do not have permission to view bookings for this event."
            )

        # 3️⃣ Authorized access only
        return Booking.objects.filter(
            event=event
        ).order_by('-booking_time')