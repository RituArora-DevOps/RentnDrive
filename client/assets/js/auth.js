// auth.js
function checkAuth() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = 'login'; // Redirect to login
        return false; // Not authenticated
    }
    return true; // Authenticated
}

async function checkAdminRole() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = 'login';
        return false;
    }

    try {
        const response = await fetch('/api/verify-admin', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            return true; // Admin role verified
        } else {
            window.location.href = 'unauthorized'; // Redirect if not admin
            return false;
        }
    } catch (error) {
        console.error('Admin role verification error:', error);
        window.location.href = 'unauthorized';
        return false;
    }
}