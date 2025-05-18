// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Login/Register Page Script
        const loginPage = document.getElementById('login-page');
        const appContainer = document.getElementById('app-container');
        const loginTabs = document.querySelectorAll('.login-tab');
        const loginForms = document.querySelectorAll('.login-form');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        // Switch between login and register tabs
        loginTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                
                // Update active tab
                loginTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding form
                loginForms.forEach(form => {
                    if (form.id === tabId + '-form-container') {
                        form.classList.add('active');
                    } else {
                        form.classList.remove('active');
                    }
                });
            });
        });

        // Handle login form submission
loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
    try {
        const response = await fetch(`${API_BASE_URL}/users/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        let data;
        try {
            data = await response.json();
        } catch (err) {
            alert('Server error: Invalid response.');
            return;
        }

        if (response.ok) {
            localStorage.setItem('user', JSON.stringify({
                _id: data.user_id,
                username: data.username,
                user_type: data.user_type || 'adopter'
            }));
            window.location.href = 'index.html';
        } else {
            alert(data.error || 'Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
    }
        });

        // Handle register form submission
registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm').value;
            const accountType = document.getElementById('account-type').value;
            
            // Validate password match
            if (password !== confirmPassword) {
                alert("Passwords don't match!");
                return;
            }

            // Validate password length
            if (password.length < 6) {
                alert("Password must be at least 6 characters long!");
                return;
            }
            
    try {
        const response = await fetch(`${API_BASE_URL}/users/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: email,
                email: email,
                password: password,
                user_type: accountType,
                first_name: name.split(' ')[0],
                last_name: name.split(' ').slice(1).join(' ')
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            // Switch to login tab
            document.querySelector('[data-tab="login"]').click();
            // Clear registration form
            registerForm.reset();
        } else {
            alert(data.error || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration. Please try again.');
    }
        });

        // Sample pet data (in a real app, this would come from a backend/API)
        const petsData = [
            {
                id: 1,
                name: "Buddy",
                type: "dog",
                breed: "Golden Retriever",
                age: 3,
                gender: "Male",
                size: "large",
                neutered: true,
                shelter: "Happy Paws Shelter",
                distance: 5,
                image: "/api/placeholder/300/200",
                tags: ["Good with kids", "Trained", "Playful"]
            },
            {
                id: 2,
                name: "Whiskers",
                type: "cat",
                breed: "Tabby",
                age: 2,
                gender: "Female",
                size: "small",
                neutered: true,
                shelter: "Feline Friends Rescue",
                distance: 3,
                image: "/api/placeholder/300/200",
                tags: ["Calm", "Indoor only", "Affectionate"]
            },
            {
                id: 3,
                name: "Max",
                type: "dog",
                breed: "Labrador Mix",
                age: 5,
                gender: "Male",
                size: "large",
                neutered: true,
                shelter: "Second Chance Shelter",
                distance: 10,
                image: "/api/placeholder/300/200",
                tags: ["Good with other pets", "Energetic", "Needs yard"]
            },
            {
                id: 4,
                name: "Luna",
                type: "cat",
                breed: "Siamese",
                age: 1,
                gender: "Female",
                size: "small",
                neutered: true,
                shelter: "Happy Tails Rescue",
                distance: 7,
                image: "/api/placeholder/300/200",
                tags: ["Shy", "Quiet home", "Cuddly"]
            },
            {
                id: 5,
                name: "Rocky",
                type: "dog",
                breed: "Pitbull",
                age: 4,
                gender: "Male",
                size: "medium",
                neutered: true,
                shelter: "City Animal Shelter",
                distance: 2,
                image: "/api/placeholder/300/200",
                tags: ["Loyal", "Needs training", "Active"]
            },
            {
                id: 6,
                name: "Charlie",
                type: "bird",
                breed: "Parakeet",
                age: 1,
                gender: "Male",
                size: "small",
                neutered: false,
                shelter: "Bird Sanctuary",
                distance: 15,
                image: "/api/placeholder/300/200",
                tags: ["Talkative", "Friendly", "Colorful"]
            }
        ];

        // DOM elements
        const petCardsContainer = document.getElementById('pet-cards-container');
        const filterBtn = document.getElementById('filter-btn');
        const petTypeSelect = document.getElementById('pet-type');
        const petSizeSelect = document.getElementById('pet-size');
        const locationInput = document.getElementById('location');
        
        // Logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        
logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
    try {
        const response = await fetch(`${API_BASE_URL}/users/logout/`, {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
});
        
        // Pet filtering functionality
async function filterPets() {
    const petType = document.getElementById('pet-type').value;
    const petSize = document.getElementById('pet-size').value;
    const location = document.getElementById('location').value.trim().toLowerCase();
            
    try {
        const queryParams = new URLSearchParams();
        if (petType) queryParams.append('type', petType);
        if (petSize) queryParams.append('size', petSize);
        if (location) queryParams.append('location', location);

        const response = await fetch(`${API_BASE_URL}/pets/search/?${queryParams}`, {
            credentials: 'include'
        });

        if (response.ok) {
            const pets = await response.json();
            displayPets(pets);
        } else {
            console.error('Failed to fetch pets');
            }
    } catch (error) {
        console.error('Error fetching pets:', error);
    }
        }
        
        // Function to display pets
        async function displayPets(pets) {
            const petsContainer = document.getElementById('pets-container');
            petsContainer.innerHTML = '';

            for (const pet of pets) {
                const petCard = document.createElement('div');
                petCard.className = 'pet-card';
                
                // Create image element
                const img = document.createElement('img');
                img.alt = pet.name;
                img.className = 'pet-image';
                
                // Construct proper image URL
                const imageUrl = pet.image ? `${API_BASE_URL}${pet.image}` : 'images/default-pet.jpg';
                
                // Load cached image
                await loadCachedImage(img, imageUrl);
                
                petCard.innerHTML = `
                    <div class="pet-info">
                        <h3>${pet.name}</h3>
                        <p>${pet.breed}</p>
                        <p>Age: ${pet.age}</p>
                        <button onclick="viewPetDetails('${pet._id}')" class="view-button">View Details</button>
                    </div>
                `;
                
                // Insert image at the beginning
                petCard.insertBefore(img, petCard.firstChild);
                petsContainer.appendChild(petCard);
            }
        }
        
// Initialize pet filtering
if (filterBtn) {
    filterBtn.addEventListener('click', filterPets);
}

// Load initial pets when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('pet-cards-container')) {
        filterPets();
    }
});

// Function to create a new pet
async function createPet(petData) {
    try {
        const formData = new FormData();
        for (const key in petData) {
            if (key === 'image' && petData[key] instanceof File) {
                formData.append('image', petData[key]);
            } else if (key === 'tags') {
                formData.append('tags', JSON.stringify(petData[key]));
            } else {
                formData.append(key, petData[key]);
            }
        }

        const response = await fetch(`${API_BASE_URL}/pets/create/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to create pet');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating pet:', error);
        throw error;
    }
}

// Function to update a pet
async function updatePet(petId, petData) {
    try {
        const formData = new FormData();
        for (const key in petData) {
            if (key === 'image' && petData[key] instanceof File) {
                formData.append('image', petData[key]);
            } else if (key === 'tags') {
                formData.append('tags', JSON.stringify(petData[key]));
            } else {
                formData.append(key, petData[key]);
            }
        }

        const response = await fetch(`${API_BASE_URL}/pets/${petId}/update/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to update pet');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating pet:', error);
        throw error;
    }
}

// Function to show pet details
async function showPetDetails(petId) {
    try {
        const response = await fetch(`${API_BASE_URL}/pets/${petId}/`);
        const pet = await response.json();

        const detailsContainer = document.getElementById('pet-details');
        const img = document.createElement('img');
        img.alt = pet.name;
        img.className = 'pet-detail-image';
        
        // Construct proper image URL
        const imageUrl = pet.image ? `${API_BASE_URL}${pet.image}` : 'images/default-pet.jpg';
        
        // Load cached image
        await loadCachedImage(img, imageUrl);

        detailsContainer.innerHTML = `
            <div class="pet-detail-content">
                <h2>${pet.name}</h2>
                <div class="pet-detail-info">
                    <p><strong>Type:</strong> ${pet.type}</p>
                    <p><strong>Breed:</strong> ${pet.breed}</p>
                    <p><strong>Age:</strong> ${pet.age} years</p>
                    <p><strong>Gender:</strong> ${pet.gender}</p>
                    <p><strong>Size:</strong> ${pet.size}</p>
                    <p><strong>Neutered:</strong> ${pet.neutered ? 'Yes' : 'No'}</p>
                    <p><strong>Description:</strong> ${pet.description}</p>
                    <p><strong>Shelter:</strong> ${pet.shelter_name || 'Unknown'}</p>
                    <p><strong>Location:</strong> ${pet.shelter_location || 'Location not specified'}</p>
                </div>
                <button onclick="applyForPet('${pet._id}')" class="apply-button">Apply for Adoption</button>
            </div>
        `;
        
        // Insert image at the beginning
        detailsContainer.insertBefore(img, detailsContainer.firstChild);
        detailsContainer.style.display = 'block';
    } catch (error) {
        console.error('Error loading pet details:', error);
        alert('Error loading pet details. Please try again.');
    }
}

// Function to convert image to base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

// Function to optimize image size
async function optimizeImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
        };
    });
}

// Add image preview functionality
document.addEventListener('DOMContentLoaded', function() {
    const petImageInput = document.getElementById('petImage');
    const imagePreview = document.getElementById('imagePreview');

    if (petImageInput && imagePreview) {
        petImageInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                try {
                    const optimizedBase64 = await optimizeImage(file);
                    imagePreview.innerHTML = `<img src="${optimizedBase64}" alt="Preview" style="max-width: 200px; margin-top: 10px;">`;
                } catch (error) {
                    console.error('Error processing image:', error);
                }
            }
        });
    }
});

// Update the add pet form submission
async function handleAddPetSubmit(event) {
    event.preventDefault();
    
    try {
        const formData = {
            name: document.getElementById('name').value,
            type: document.getElementById('type').value,
            breed: document.getElementById('breed').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            size: document.getElementById('size').value,
            neutered: document.getElementById('neutered').value,
            description: document.getElementById('description').value,
            shelter_id: document.getElementById('shelter_id').value
        };

        // Handle image
        const imageFile = document.getElementById('petImage').files[0];
        if (imageFile) {
            formData.image = await optimizeImage(imageFile);
        }

        const response = await fetch('/api/pets/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Pet added successfully!');
            window.location.href = '/pets.html';
        } else {
            const error = await response.json();
            alert('Error adding pet: ' + (error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding pet. Please try again.');
    }
}

// Image caching utility
async function getCachedImage(url) {
    try {
        // Check if image is in cache
        const cachedImage = localStorage.getItem(`img_${url}`);
        if (cachedImage) {
            return cachedImage;
        }

        // If not in cache, fetch and store
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch image');
        }
        const blob = await response.blob();
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

        // Store in cache
        localStorage.setItem(`img_${url}`, base64);
        return base64;
    } catch (error) {
        console.error('Error caching image:', error);
        return 'images/default-pet.jpg'; // Return default image if caching fails
    }
}

// Function to load and display cached images
async function loadCachedImage(imgElement, imageUrl) {
    try {
        const cachedImage = await getCachedImage(imageUrl);
        imgElement.src = cachedImage;
        imgElement.onerror = () => {
            imgElement.src = 'images/default-pet.jpg';
        };
    } catch (error) {
        console.error('Error loading cached image:', error);
        imgElement.src = 'images/default-pet.jpg';
    }
}