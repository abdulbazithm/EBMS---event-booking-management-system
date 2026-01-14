from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer
from .models import User


class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "is_admin": user.is_staff,
            "is_organizer": user.is_organizer() if hasattr(user, "is_organizer") else False
        })



class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
