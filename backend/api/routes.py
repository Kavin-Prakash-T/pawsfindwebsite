from flask import Blueprint, request, jsonify
from .models import Application, Pet
from .database import db
from datetime import datetime

api = Blueprint('api', __name__)

# ... existing routes ...

@api.route('/applications/', methods=['POST'])
def create_application():
    try:
        data = request.json
        
        # Get pet details
        pet = Pet.get_by_id(data['pet_id'])
        if not pet:
            return jsonify({"error": "Pet not found"}), 404
            
        # Create application with pet details
        application_data = {
            'pet_id': data['pet_id'],
            'user_id': data['user_id'],
            'message': data['message'],
            'status': data.get('status', 'pending'),
            'pet_details': {
                'name': pet['name'],
                'type': pet['type'],
                'breed': pet['breed'],
                'age': pet['age'],
                'gender': pet['gender'],
                'size': pet['size'],
                'image': pet.get('image'),
                'description': pet['description']
            },
            'submitted_at': data.get('submitted_at')
        }
        
        application_id = Application.create(application_data)
        return jsonify({"message": "Application submitted successfully", "id": application_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/applications/', methods=['GET'])
def get_applications():
    try:
        user_id = request.args.get('user_id')
        if user_id:
            applications = Application.get_by_applicant(user_id)
        else:
            applications = Application.get_all()
        
        # Convert ObjectId to string for JSON serialization
        for app in applications:
            app['_id'] = str(app['_id'])
        
        return jsonify(applications), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/applications/<application_id>', methods=['GET'])
def get_application(application_id):
    try:
        application = Application.get_by_id(application_id)
        if application:
            application['_id'] = str(application['_id'])
            return jsonify(application), 200
        return jsonify({"error": "Application not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/applications/<application_id>', methods=['PUT'])
def update_application(application_id):
    try:
        data = request.json
        update_data = {
            "status": data.get('status'),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = Application.update(application_id, update_data)
        if result.modified_count:
            return jsonify({"message": "Application updated successfully"}), 200
        return jsonify({"error": "Application not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400 