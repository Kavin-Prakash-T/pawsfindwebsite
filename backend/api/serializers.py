from rest_framework import serializers
from bson import ObjectId
from .models import Pet, Shelter, Application, User

class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        return ObjectId(data)

class UserSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

class PetSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    name = serializers.CharField(max_length=100)
    type = serializers.CharField(max_length=50)
    breed = serializers.CharField(max_length=100)
    age = serializers.IntegerField()
    gender = serializers.CharField(max_length=10)
    size = serializers.CharField(max_length=20)
    neutered = serializers.BooleanField()
    description = serializers.CharField()
    image = serializers.CharField(required=False, allow_blank=True)
    shelter_id = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

class ShelterSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    name = serializers.CharField(max_length=100)
    location = serializers.CharField(max_length=200)
    contact = serializers.CharField(max_length=100, required=False)
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(max_length=20, required=False)
    description = serializers.CharField()
    image = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

class ApplicationSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    pet_id = serializers.CharField()
    applicant_id = serializers.CharField(required=False)
    status = serializers.CharField(max_length=20)
    notes = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True) 