document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const errorMessage = document.getElementById("errorMessage");

            // Clear previous errors
            errorMessage.textContent = "";

            if (!email || !password) {
                errorMessage.textContent = "Both fields are required!";
                return;
            }

            try {
                const response = await fetch("/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Store data in sessionStorage instead of localStorage
                    sessionStorage.setItem("token", data.token);
                    sessionStorage.setItem("user", JSON.stringify(data.user));

                    alert("Login successful!");

                    // Redirect based on user role
                    if (data.user.role === "admin") {
                        window.location.href = "admin.html";
                    } else {
                        window.location.href = "dashboard.html";
                    }
                } else {
                    errorMessage.textContent = data.message || "Invalid credentials. Try again!";
                }
            } catch (error) {
                console.error("Error:", error);
                errorMessage.textContent = "Server error. Please try again later.";
            }
        });
    }
});
