from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv
import logging
import sys

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def connect_to_mongodb():
    try:
        # MongoDB connection with options
        client = MongoClient(
            'mongodb://localhost:27017/',  # Your original connection string
            serverSelectionTimeoutMS=5000,  # 5 second timeout
            connectTimeoutMS=5000,
            socketTimeoutMS=5000,
            directConnection=True  # Force direct connection
        )
        
        # Test the connection
        client.server_info()
        logger.info("Successfully connected to MongoDB")
        return client
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        logger.error("Please make sure MongoDB is installed and running")
        logger.error("You can download MongoDB from: https://www.mongodb.com/try/download/community")
        sys.exit(1)

try:
    # Connect to MongoDB
    client = connect_to_mongodb()
    
    # Get database
    db = client['pawsfind_db']
    
    # Collections
    users_collection = db['users']
    pets_collection = db['pets']
    shelters_collection = db['shelters']
    applications_collection = db['applications']
    
    # Create indexes for better performance
    users_collection.create_index('username', unique=True)
    users_collection.create_index('email', unique=True)
    pets_collection.create_index('shelter_id')
    applications_collection.create_index('pet_id')
    applications_collection.create_index('applicant_id')
    
except Exception as e:
    logger.error(f"Failed to initialize database: {str(e)}")
    raise

# Helper functions
def get_object_id(id_str):
    try:
        return ObjectId(id_str)
    except Exception as e:
        logger.error(f"Invalid ObjectId: {str(e)}")
        return None

def format_id(document):
    if document and '_id' in document:
        document['_id'] = str(document['_id'])
    return document

def format_ids(documents):
    return [format_id(doc) for doc in documents]

# Test database connection
def test_connection():
    try:
        # Try to insert and delete a test document
        test_collection = db['test_connection']
        test_collection.insert_one({'test': 'connection'})
        test_collection.delete_one({'test': 'connection'})
        logger.info("Database connection test successful")
        return True
    except Exception as e:
        logger.error(f"Database connection test failed: {str(e)}")
        return False 