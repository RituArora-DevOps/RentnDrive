document.addEventListener('DOMContentLoaded', () => {
    // Register Form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const phone = document.getElementById('phone').value;

        // Client-side validations
        if (!username || !email || !password || !confirmPassword || !phone) {
            alert('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const phoneRegex = /^[0-9-]+$/;
        if (!phoneRegex.test(phone)) {
            alert('Invalid phone number format.');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, phone }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Registration successful!');
                window.location.href = 'login';
            } else {
                alert(data.message || 'Registration failed.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration.');
        }
    });
}


    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('role', data.role);
                    sessionStorage.setItem('userId', data.id);
                    sessionStorage.setItem('username', data.username);
                    alert('Login successful!');

                    if (data.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else if (data.role === 'customer') {
                        window.location.href = 'dashboard.html'; // Or booking page
                    } else {
                        window.location.href = 'index.html'; // Default redirect
                    }
                } else {
                    alert(data.message || 'Login failed.');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred during login.');
            }
        });
    }
});