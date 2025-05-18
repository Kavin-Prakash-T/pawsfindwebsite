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
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
    try {
        const response = await fetch(`${API_BASE_URL}/users/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                username: email,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials. Please try again.');
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
            
            if (password !== confirmPassword) {
                alert("Passwords don't match!");
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

        if (response.ok) {
            alert('Registration successful! Please login.');
            // Switch to login tab
            document.querySelector('[data-tab="login"]').click();
        } else {
            const data = await response.json();
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
        
        function displayPets(pets) {
            // Clear existing cards
            petCardsContainer.innerHTML = '';
            
            if (pets.length === 0) {
                petCardsContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; font-size: 18px; margin: 30px 0;">No pets match your search criteria. Please try different filters.</p>';
                return;
            }
            
            // Create pet cards
            pets.forEach(pet => {
                const petCard = document.createElement('div');
                petCard.className = 'pet-card';
                
                const neuteredText = pet.neutered ? 'Neutered' : 'Not neutered';
        const imageUrl = pet.image ? `http://localhost:8000${pet.image}` : 'https://via.placeholder.com/300x200?text=No+Image';
                
                petCard.innerHTML = `
                    <div class="pet-img">
                <img src="${imageUrl}" alt="${pet.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                    </div>
                    <div class="pet-info">
                        <h3 class="pet-name">${pet.name}</h3>
                        <div class="pet-details">
                            <p>${pet.breed} • ${pet.age} ${pet.age === 1 ? 'year' : 'years'} old</p>
                            <p>${pet.gender} • ${neuteredText}</p>
                    <p>${pet.shelter_name} • ${pet.shelter_location || 'Location not specified'}</p>
                        </div>
                        <div class="pet-tags">
                            ${pet.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                <a href="#" class="btn pet-details-btn" data-id="${pet._id}" style="margin-top: 15px;">Learn More</a>
                    </div>
                `;
                
                petCardsContainer.appendChild(petCard);
            });
            
            // Add event listeners to "Learn More" buttons
            document.querySelectorAll('.pet-details-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const petId = this.getAttribute('data-id');
            // Handle pet details view
            console.log(`View details for pet ${petId}`);
                });
            });
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

// Function to display pets
function displayPets(pets) {
    const petsContainer = document.getElementById('pets-container');
    petsContainer.innerHTML = '';

    pets.forEach(pet => {
        const imageUrl = pet.image ? `${API_BASE_URL}${pet.image}` : 'https://via.placeholder.com/300x200?text=No+Image';
        const shelterLocation = pet.shelter_location || 'Location not specified';
        
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        petCard.innerHTML = `
            <img src="${imageUrl}" alt="${pet.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="pet-info">
                <h3>${pet.name}</h3>
                <p><strong>Type:</strong> ${pet.type}</p>
                <p><strong>Breed:</strong> ${pet.breed}</p>
                <p><strong>Age:</strong> ${pet.age} years</p>
                <p><strong>Gender:</strong> ${pet.gender}</p>
                <p><strong>Size:</strong> ${pet.size}</p>
                <p><strong>Shelter:</strong> ${pet.shelter_name || 'Unknown'}</p>
                <p><strong>Location:</strong> ${shelterLocation}</p>
                <button class="learn-more" data-id="${pet._id}">Learn More</button>
            </div>
        `;
        petsContainer.appendChild(petCard);
    });

    // Add event listeners to "Learn More" buttons
    document.querySelectorAll('.learn-more').forEach(button => {
        button.addEventListener('click', () => {
            const petId = button.getAttribute('data-id');
            showPetDetails(petId);
        });
    });
}

// Function to show pet details
async function showPetDetails(petId) {
    try {
        const response = await fetch(`${API_BASE_URL}/pets/${petId}/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch pet details');
        }

        const pet = await response.json();
        const imageUrl = pet.image ? `${API_BASE_URL}${pet.image}` : 'https://via.placeholder.com/300x200?text=No+Image';
        const shelterLocation = pet.shelter_location || 'Location not specified';

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <img src="${imageUrl}" alt="${pet.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                <div class="pet-details">
                    <h2>${pet.name}</h2>
                    <p><strong>Type:</strong> ${pet.type}</p>
                    <p><strong>Breed:</strong> ${pet.breed}</p>
                    <p><strong>Age:</strong> ${pet.age} years</p>
                    <p><strong>Gender:</strong> ${pet.gender}</p>
                    <p><strong>Size:</strong> ${pet.size}</p>
                    <p><strong>Neutered:</strong> ${pet.neutered ? 'Yes' : 'No'}</p>
                    <p><strong>Description:</strong> ${pet.description}</p>
                    <p><strong>Shelter:</strong> ${pet.shelter_name || 'Unknown'}</p>
                    <p><strong>Location:</strong> ${shelterLocation}</p>
                    <p><strong>Tags:</strong> ${pet.tags.join(', ')}</p>
                    <button class="apply-button" data-id="${pet._id}">Apply for Adoption</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal when clicking the X
        modal.querySelector('.close').addEventListener('click', () => {
            modal.remove();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Handle adoption application
        modal.querySelector('.apply-button').addEventListener('click', () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert('Please log in to apply for adoption');
                return;
            }
            if (user.user_type !== 'adopter') {
                alert('Only adopters can apply for adoption');
                return;
            }
            showApplicationForm(pet);
        });
    } catch (error) {
        console.error('Error showing pet details:', error);
        alert('Failed to load pet details');
    }
}