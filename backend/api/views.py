from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login, logout
from .models import Pet, Shelter, Application, User
import json
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import base64
from django.views.decorators.http import require_http_methods
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer, PetSerializer, ShelterSerializer, ApplicationSerializer
from bson import ObjectId
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["GET"])
def api_root(request):
    """API root view showing available endpoints"""
    return JsonResponse({
        'endpoints': {
            'register': '/api/register/',
            'login': '/api/login/',
            'logout': '/api/logout/',
            'pets': '/api/pets/',
            'add_pet': '/api/pets/add/',
            'apply_pet': '/api/pets/apply/',
            'applications': '/api/applications/'
        }
    })

class UserViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user_id = User.create(serializer.validated_data)
            return Response({
                'message': 'User registered successfully',
                'user_id': user_id,
                'username': serializer.validated_data['username']
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = User.authenticate(username, password)
        if user:
            login(request, user)
            return Response({
                'message': 'Login successful',
                'user_id': str(user['_id']),
                'username': user['username']
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        logout(request)
        return Response({'message': 'Logout successful'})

class ShelterViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    serializer_class = ShelterSerializer

    def list(self, request):
        shelters = Shelter.get_all()
        serializer = self.serializer_class(shelters, many=True)
        return Response(serializer.data)

    def create(self, request):
        try:
            data = request.data.copy()
            
            # Handle image upload
            image_data = data.get('image')
            if image_data:
                try:
                    # If it's already a base64 string, use it directly
                    if isinstance(image_data, str) and image_data.startswith('data:image'):
                        # Keep the full base64 string
                        data['image'] = image_data
                    else:
                        # If it's a file or other format, handle accordingly
                        if ',' in image_data:
                            image_data = image_data.split(',')[1]
                        image_bytes = base64.b64decode(image_data)
                        filename = f"shelters/{data['name']}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.jpg"
                        path = default_storage.save(filename, ContentFile(image_bytes))
                        data['image'] = f"/media/{path}"
                except Exception as e:
                    logger.error(f"Error processing image: {str(e)}")
                    return Response({'error': f'Error processing image: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.serializer_class(data=data)
            if serializer.is_valid():
                shelter_id = Shelter.create(serializer.validated_data)
                return Response({
                    'message': 'Shelter created successfully',
                    'shelter_id': shelter_id
                }, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Error creating shelter: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        shelter = Shelter.get_by_id(pk)
        if shelter:
            serializer = self.serializer_class(shelter)
            return Response(serializer.data)
        return Response({'error': 'Shelter not found'}, status=status.HTTP_404_NOT_FOUND)

class PetViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    serializer_class = PetSerializer

    def list(self, request):
        pets = Pet.get_all()
        serializer = self.serializer_class(pets, many=True)
        return Response(serializer.data)

    def create(self, request):
        try:
            data = request.data.copy()
            
            # Handle image upload
            image_data = data.get('image')
            if image_data:
                try:
                    # If it's already a base64 string, use it directly
                    if isinstance(image_data, str) and image_data.startswith('data:image'):
                        # Keep the full base64 string
                        data['image'] = image_data
                    else:
                        # If it's a file or other format, handle accordingly
                        if ',' in image_data:
                            image_data = image_data.split(',')[1]
                        image_bytes = base64.b64decode(image_data)
                        filename = f"pets/{data['name']}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.jpg"
                        path = default_storage.save(filename, ContentFile(image_bytes))
                        data['image'] = f"/media/{path}"
                except Exception as e:
                    logger.error(f"Error processing image: {str(e)}")
                    return Response({'error': f'Error processing image: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.serializer_class(data=data)
            if serializer.is_valid():
                pet_id = Pet.create(serializer.validated_data)
                return Response({
                    'message': 'Pet added successfully',
                    'pet_id': pet_id
                }, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Error creating pet: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        pet = Pet.get_by_id(pk)
        if pet:
            serializer = self.serializer_class(pet)
            return Response(serializer.data)
        return Response({'error': 'Pet not found'}, status=status.HTTP_404_NOT_FOUND)

class AdoptionApplicationViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    serializer_class = ApplicationSerializer

    def list(self, request):
        applications = Application.get_all()
        serializer = self.serializer_class(applications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def apply(self, request):
        try:
            pet_id = request.data.get('pet_id')
            user_id = request.data.get('user_id')
            notes = request.data.get('notes', '')
            
            if not all([pet_id, user_id]):
                return Response({'error': 'Pet ID and User ID are required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if pet exists
            pet = Pet.get_by_id(pet_id)
            if not pet:
                return Response({'error': 'Pet not found'}, status=status.HTTP_404_NOT_FOUND)
            
            # Check if user exists
            user = User.get_by_id(user_id)
            if not user:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
            # Check if application already exists
            existing_apps = Application.get_by_applicant(user_id)
            if any(app['pet_id'] == pet_id for app in existing_apps):
                return Response({'error': 'You have already applied for this pet'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create application
            application_data = {
                'pet_id': pet_id,
                'applicant_id': user_id,
                'status': 'pending',
                'notes': notes
            }
            application_id = Application.create(application_data)
            
            return Response({
                'message': 'Application submitted successfully',
                'application_id': application_id
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def user_applications(self, request):
        user_id = request.query_params.get('user_id')
        
        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            applications = Application.get_by_applicant(user_id)
            serializer = self.serializer_class(applications, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def pet_applications(self, request):
        pet_id = request.query_params.get('pet_id')
        
        if not pet_id:
            return Response({'error': 'Pet ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            applications = Application.get_by_pet(pet_id)
            serializer = self.serializer_class(applications, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
