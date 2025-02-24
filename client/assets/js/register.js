const form = document.getElementById("signup-form");

function handleSubmit(event) {
  event.preventDefault();

  const formData = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    password: document.getElementById("password").value,
    confirmPassword: document.getElementById("confirmPassword").value,
  };

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // Send the data to the server
  fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      password_hash: formData.password,  // Assuming password is hashed on the server side
      role: "customer", // Default role (TOTHINK: if we need to hadle role on the frontend side or we can assign a few owners of emails as admins)
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("User successfully signed up", data);
      window.location.href = "/login"; // Redirect to login after successful signup
    })
    .catch((error) => {
      console.error("Error signing up user:", error);
    });
}
