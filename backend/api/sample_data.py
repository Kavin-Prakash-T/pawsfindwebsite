from db import db, users_collection, shelters_collection, pets_collection, applications_collection
import bcrypt
from datetime import datetime

def create_sample_data():
    # Clear existing data
    users_collection.delete_many({})
    shelters_collection.delete_many({})
    pets_collection.delete_many({})
    applications_collection.delete_many({})

    # Create sample shelter user
    shelter_password = bcrypt.hashpw('shelter123'.encode('utf-8'), bcrypt.gensalt())
    shelter_user = {
        'username': 'happypaws',
        'email': 'happypaws@example.com',
        'password': shelter_password,
        'user_type': 'shelter',
        'first_name': 'Happy',
        'last_name': 'Paws',
        'phone': '555-0123',
        'address': '123 Pet Street, Animalville'
    }
    shelter_user_id = str(users_collection.insert_one(shelter_user).inserted_id)

    # Create sample adopter user
    adopter_password = bcrypt.hashpw('adopter123'.encode('utf-8'), bcrypt.gensalt())
    adopter_user = {
        'username': 'johndoe',
        'email': 'john@example.com',
        'password': adopter_password,
        'user_type': 'adopter',
        'first_name': 'John',
        'last_name': 'Doe',
        'phone': '555-0124',
        'address': '456 Home Street, Petville'
    }
    adopter_user_id = str(users_collection.insert_one(adopter_user).inserted_id)

    # Create sample shelter
    shelter = {
        'name': 'Happy Paws Shelter',
        'user_id': shelter_user_id,
        'description': 'A loving home for pets in need',
        'location': 'Animalville',
        'phone': '555-0123',
        'email': 'happypaws@example.com',
        'website': 'www.happypaws.com',
        'created_at': datetime.utcnow()
    }
    shelter_id = str(shelters_collection.insert_one(shelter).inserted_id)

    # Create sample pets
    pets = [
        {
            'name': 'Buddy',
            'type': 'dog',
            'breed': 'Golden Retriever',
            'age': 3,
            'gender': 'Male',
            'size': 'large',
            'neutered': True,
            'description': 'Friendly and playful dog',
            'image': '/media/pets/buddy.jpg',
            'shelter_id': shelter_id,
            'tags': ['Good with kids', 'Trained', 'Playful'],
            'created_at': datetime.utcnow()
        },
        {
            'name': 'Whiskers',
            'type': 'cat',
            'breed': 'Tabby',
            'age': 2,
            'gender': 'Female',
            'size': 'small',
            'neutered': True,
            'description': 'Calm and affectionate cat',
            'image': '/media/pets/whiskers.jpg',
            'shelter_id': shelter_id,
            'tags': ['Calm', 'Indoor only', 'Affectionate'],
            'created_at': datetime.utcnow()
        }
    ]

    for pet in pets:
        pets_collection.insert_one(pet)

    # Create sample adoption application
    application = {
        'pet_id': str(pets_collection.find_one({'name': 'Buddy'})['_id']),
        'adopter_id': adopter_user_id,
        'status': 'pending',
        'notes': 'I have a large backyard and experience with dogs.',
        'created_at': datetime.utcnow()
    }
    applications_collection.insert_one(application)

if __name__ == '__main__':
    create_sample_data()
    print("Sample data created successfully!") 