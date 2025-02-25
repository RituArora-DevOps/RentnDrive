// booking.js - Enhanced Booking with Payment

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get("id");
    const userId = localStorage.getItem("userId"); // Assuming user ID is stored on login

    if (!carId) {
        alert("No car selected!");
        return;
    }

    try {
        const response = await fetch(`/api/cars/${carId}`);
        if (!response.ok) throw new Error("Car not found");

        const car = await response.json();
        document.getElementById("car-title").textContent = `${car.make} ${car.model} ${car.year}`;
        document.getElementById("car-image").src = car.imageUrl;
        document.getElementById("price-per-day").innerHTML = `<strong>Price per day:</strong> $${car.price_per_day}`;
        document.getElementById("car-description").textContent = car.description;

        const pricePerDay = parseFloat(car.price_per_day);
        const startDate = document.getElementById("start-date");
        const endDate = document.getElementById("end-date");
        const extraInput = document.getElementById("extra");
        const totalPriceElement = document.getElementById("total-price");

        function calculateTotalPrice() {
            const start = new Date(startDate.value);
            const end = new Date(endDate.value);
            const extra = parseFloat(extraInput.value) || 0;

            if (start && end && start < end) {
                const days = (end - start) / (1000 * 60 * 60 * 24);
                const totalPrice = days * pricePerDay + extra;
                totalPriceElement.innerHTML = `<strong>Total Price:</strong> $${totalPrice.toFixed(2)}`;
            } else {
                totalPriceElement.innerHTML = `<strong>Total Price:</strong> $0`;
            }
        }

        startDate.addEventListener("change", calculateTotalPrice);
        endDate.addEventListener("change", calculateTotalPrice);
        extraInput.addEventListener("input", calculateTotalPrice);

        // Handle Booking & Payment
        document.getElementById("book-button").addEventListener("click", async () => {
            const cardName = document.getElementById("card-name").value;
            const cardNumber = document.getElementById("card-number").value;
            const expiryDate = document.getElementById("expiry-date").value;
            const cvv = document.getElementById("cvv").value;

            if (!cardName || !cardNumber || !expiryDate || !cvv) {
                alert("Please fill all payment fields.");
                return;
            }

            const bookingData = {
                user_id: userId,
                car_id: carId,
                start_date: startDate.value,
                end_date: endDate.value,
                total_amount: parseFloat(totalPriceElement.textContent.replace(/[^0-9.]/g, "")),
                extra: extraInput.value,
                payment_method: "credit_card",
                payment_status: "pending"
            };

            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();
            if (response.ok) {
                alert("Booking successful!");
            } else {
                alert(result.message);
            }
        });
    } catch (error) {
        console.error("Error loading car details:", error);
        alert("Could not load car details.");
    }
});
