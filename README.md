# PawsFind - Pet Adoption Platform

A full-stack web application for pet adoption, built with Django and MongoDB for the backend, and HTML/CSS/JavaScript for the frontend.

## Features

- User authentication (Pet Adopters and Animal Shelters)
- Pet listing and search functionality
- Filter pets by type, size, and location
- Adoption application system
- User profiles and dashboards

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Unix or MacOS:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. The frontend is already set up in the `frontend` directory
2. Open the HTML files directly in your browser or use a local server
3. Make sure the backend server is running before using the application

## API Endpoints

- `/api/users/` - User management (register, login, logout)
- `/api/shelters/` - Shelter management
- `/api/pets/` - Pet listing and management
- `/api/applications/` - Adoption application management

## Technologies Used

- Backend:
  - Django
  - Django REST Framework
  - MongoDB (via Djongo)
  - Django CORS Headers

- Frontend:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Font Awesome Icons

## Developer

Designed and developed by Kavin Prakash 