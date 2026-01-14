from django.urls import path
from .views import MeAPIView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeAPIView.as_view(), name="me"),
]
