from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'pets', views.PetViewSet, basename='pet')
router.register(r'shelters', views.ShelterViewSet, basename='shelter')
router.register(r'applications', views.AdoptionApplicationViewSet, basename='application')

urlpatterns = [
    path('', include(router.urls)),
] 