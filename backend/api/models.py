# No Django ORM models are used. All data is managed via PyMongo.

from datetime import datetime
from bson import ObjectId
from .db import pets_collection, shelters_collection, applications_collection, users_collection
from django.contrib.auth.hashers import make_password, check_password

class Pet:
    def __init__(self, name, type, breed, age, gender, size, neutered, description, image, shelter_id):
        self.name = name
        self.type = type
        self.breed = breed
        self.age = age
        self.gender = gender
        self.size = size
        self.neutered = neutered
        self.description = description
        self.image = image
        self.shelter_id = shelter_id
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    @staticmethod
    def create(pet_data):
        pet = Pet(**pet_data)
        result = pets_collection.insert_one(pet.__dict__)
        return str(result.inserted_id)

    @staticmethod
    def get_all():
        return list(pets_collection.find())

    @staticmethod
    def get_by_id(pet_id):
        return pets_collection.find_one({'_id': ObjectId(pet_id)})

    @staticmethod
    def update(pet_id, pet_data):
        pet_data['updated_at'] = datetime.utcnow()
        return pets_collection.update_one(
            {'_id': ObjectId(pet_id)},
            {'$set': pet_data}
        )

    @staticmethod
    def delete(pet_id):
        return pets_collection.delete_one({'_id': ObjectId(pet_id)})

class Shelter:
    def __init__(self, name, location, contact, description, image=None, email=None, phone=None):
        self.name = name
        self.location = location
        self.contact = contact
        self.description = description
        # Validate image is base64 if provided
        if image and not (isinstance(image, str) and image.startswith('data:image')):
            raise ValueError('Image must be a base64 string starting with data:image')
        self.image = image
        self.email = email
        self.phone = phone
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    @staticmethod
    def create(shelter_data):
        # Validate image is base64 if provided
        if 'image' in shelter_data and shelter_data['image']:
            if not (isinstance(shelter_data['image'], str) and shelter_data['image'].startswith('data:image')):
                raise ValueError('Image must be a base64 string starting with data:image')
        
        shelter = Shelter(**shelter_data)
        result = shelters_collection.insert_one(shelter.__dict__)
        return str(result.inserted_id)

    @staticmethod
    def get_all():
        return list(shelters_collection.find())

    @staticmethod
    def get_by_id(shelter_id):
        return shelters_collection.find_one({'_id': ObjectId(shelter_id)})

    @staticmethod
    def update(shelter_id, shelter_data):
        # Validate image is base64 if provided
        if 'image' in shelter_data and shelter_data['image']:
            if not (isinstance(shelter_data['image'], str) and shelter_data['image'].startswith('data:image')):
                raise ValueError('Image must be a base64 string starting with data:image')
        
        shelter_data['updated_at'] = datetime.utcnow()
        return shelters_collection.update_one(
            {'_id': ObjectId(shelter_id)},
            {'$set': shelter_data}
        )

    @staticmethod
    def delete(shelter_id):
        return shelters_collection.delete_one({'_id': ObjectId(shelter_id)})

class Application:
    def __init__(self, pet_id, user_id, message, status="pending", pet_details=None, submitted_at=None):
        self._id = str(ObjectId())
        self.pet_id = pet_id
        self.user_id = user_id
        self.message = message
        self.status = status
        self.pet_details = pet_details or {}
        self.submitted_at = submitted_at or datetime.utcnow().isoformat()

    def to_dict(self):
        return {
            "_id": self._id,
            "pet_id": self.pet_id,
            "user_id": self.user_id,
            "message": self.message,
            "status": self.status,
            "pet_details": self.pet_details,
            "submitted_at": self.submitted_at
        }

    @staticmethod
    def create(application_data):
        application = Application(**application_data)
        result = applications_collection.insert_one(application.__dict__)
        return str(result.inserted_id)

    @staticmethod
    def get_all():
        return list(applications_collection.find())

    @staticmethod
    def get_by_id(application_id):
        return applications_collection.find_one({'_id': ObjectId(application_id)})

    @staticmethod
    def get_by_applicant(applicant_id):
        return list(applications_collection.find({'applicant_id': applicant_id}))

    @staticmethod
    def get_by_pet(pet_id):
        return list(applications_collection.find({'pet_id': pet_id}))

    @staticmethod
    def update(application_id, application_data):
        application_data['updated_at'] = datetime.utcnow()
        return applications_collection.update_one(
            {'_id': ObjectId(application_id)},
            {'$set': application_data}
        )

    @staticmethod
    def delete(application_id):
        return applications_collection.delete_one({'_id': ObjectId(application_id)})

class User:
    collection = users_collection

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = make_password(password)
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    @classmethod
    def get_by_email(cls, email):
        return cls.collection.find_one({'email': email})

    @classmethod
    def check_password(cls, input_password, stored_password):
        # For now, simple direct comparison
        # In production, you should use proper password hashing
        return input_password == stored_password

    @classmethod
    def create(cls, data):
        user_data = {
            'username': data['username'],
            'email': data['email'],
            'password': data['password'],  # In production, hash this password
            'user_type': data.get('user_type', 'adopter'),
            'first_name': data.get('first_name', ''),
            'last_name': data.get('last_name', ''),
            'created_at': datetime.utcnow()
        }
        result = cls.collection.insert_one(user_data)
        return result.inserted_id

    @staticmethod
    def get_by_id(user_id):
        return users_collection.find_one({'_id': ObjectId(user_id)})

    @staticmethod
    def authenticate(email, password):
        user = User.get_by_email(email)
        if user and User.check_password(password, user['password']):
            return {
                '_id': user['_id'],
                'username': user['username'],
                'email': user['email'],
                'user_type': user.get('user_type', 'adopter')
            }
        return None
