document.addEventListener("DOMContentLoaded", () => {
  // 1. Authentication Check
  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");
  if (!token || !username) {
    window.location.href = "/login?next=/booking-payment" + window.location.search;
    return;
  }
  document.getElementById("welcome-message").textContent = `Welcome, ${username}`;

  // 2. Retrieve carId from query parameters
  const params = new URLSearchParams(window.location.search);
  const carId = params.get('carId');
  if (!carId) {
    alert("No car selected.");
    window.location.href = "/search_results";
    return;
  }

  // 3. Fetch Car Details from API and fill in read-only fields
  fetch(`/api/car/cars/${carId}`)
    .then(res => res.json())
    .then(car => {
      document.getElementById("car-title").textContent =
        `Booking for ${car.make} ${car.model} (${car.year})`;
      document.getElementById("car-image").src =
        car.image_url || '../assets/images/default-car.jpg';
      document.getElementById("make").value = car.make;
      document.getElementById("year").value = car.year;
      document.getElementById("type").value = car.type;
      document.getElementById("price-per-day").value = car.price_per_day;
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load car details.");
    });

  // 4. Calculate Total Price when dates are entered/changed
  const calculateTotal = () => {
    const start = document.getElementById("start-date").value;
    const end = document.getElementById("end-date").value;
    const price = parseFloat(document.getElementById("price-per-day").value);
    if (start && end && price && new Date(start) < new Date(end)) {
      const days = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24) + 1;
      const totalPrice = price * days;
      document.getElementById("total-price").innerHTML =
        `<strong>Total Price:</strong> $${totalPrice.toFixed(2)}`;
    }
  };

  document.getElementById("start-date").addEventListener("change", calculateTotal);
  document.getElementById("end-date").addEventListener("change", calculateTotal);

  // 5. Handle Booking & Payment Submission
  document.getElementById("book-button").addEventListener("click", async () => {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const extra = document.getElementById("extra").value;

    // Validate booking dates
    if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
      alert("Please select a valid date range.");
      return;
    }

    const cardholderName = document.getElementById("cardholder-name").value;
    const cardNumber = document.getElementById("card-number").value;
    const expiryDate = document.getElementById("expiry-date").value;
    const cvv = document.getElementById("cvv").value;

    // Validate payment fields
    if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
      alert("Please fill in all payment fields.");
      return;
    }

    // Recalculate total amount
    const price = parseFloat(document.getElementById("price-per-day").value);
    const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
    const totalAmount = price * days;

    try {
      const response = await fetch("/api/booking/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          carId,
          startDate,
          endDate,
          paymentMethod: "credit_card",
          amount: totalAmount,
          extra
          // Note: In a real integration, you’d securely handle card details via a payment gateway.
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Booking failed");
      }

      const bookingData = await response.json();
      console.log("Booking created:", bookingData);
      document.getElementById("modal-message").textContent =
        `Booking successful! Your Booking ID: ${bookingData.id}`;
      document.getElementById("payment-modal").style.display = "block";
    } catch (error) {
      console.error("Error during booking:", error);
      document.getElementById("modal-message").textContent =
        `Booking failed: ${error.message}`;
      document.getElementById("payment-modal").style.display = "block";
    }
  });

  // 6. Modal Close Handler
  document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("payment-modal").style.display = "none";
  });

  // 7. Logout Functionality
  document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("userId");
    window.location.href = "/login";
  });
});