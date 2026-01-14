from rest_framework import serializers
from .models import Category, Event

class EventSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all()
    )
    available_seats = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'description',
            'location',
            'category',
            'event_date',
            'event_time',
            'total_seats',
            'booked_seats',
            'available_seats',
            'image'
        ]
        read_only_fields = ['booked_seats', 'available_seats']

    def get_available_seats(self, obj):
        return obj.available_seats()
    
      #  NEW: Prevent reducing total_seats below booked_seats
    def validate_total_seats(self, value):
        instance = self.instance
        if instance and value < instance.booked_seats:
            raise serializers.ValidationError(
                "Total seats cannot be less than already booked seats."
            )
        return value

    def create(self, validated_data):
        user = self.context['request'].user  # Organizer from JWT token
        event = Event.objects.create(organizer=user, **validated_data)
        return event
    
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

