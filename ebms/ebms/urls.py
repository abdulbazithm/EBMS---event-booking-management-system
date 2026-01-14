from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # App APIs
    path('api/accounts/', include('accounts.urls')),
    path('api/events/', include('events.urls')),
    path('api/bookings/', include('bookings.urls')),

    # Auth endpoints (login, logout, password reset, etc.)
    path('api/auth/', include('dj_rest_auth.urls')),

     
]
