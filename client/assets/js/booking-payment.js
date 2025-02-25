document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get("id");
  const userId = localStorage.getItem("userId"); // 假设用户 ID 在登录时存储

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

    document.getElementById("book-button").addEventListener("click", async () => {
      let paymentSuccess = Math.random() > 0.5;
      let modal = document.getElementById("payment-modal");
      let message = document.getElementById("modal-message");

      if (paymentSuccess) {
        message.textContent = "You have successfully paid and booked a car. Thank you!";
      } else {
        message.textContent = "Payment wasn't successful. Please retry and complete the payment.";
      }

      modal.style.display = "block";
    });

    document.getElementById("close-modal").addEventListener("click", function () {
      document.getElementById("payment-modal").style.display = "none";
    });

  } catch (error) {
    console.error("Error loading car details:", error);
    alert("Could not load car details.");
  }
});
