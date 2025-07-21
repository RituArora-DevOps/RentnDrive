document.addEventListener("DOMContentLoaded", async function () {
  // ----------------- Element Declarations -----------------
  const carListContainer = document.getElementById("car-list");
  const filtersForm = document.getElementById("filters-form");
  // Check if the user is logged in by looking for a token
  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");
  const authButtonsContainer = document.querySelector(".auth-buttons");

  if (token && username && authButtonsContainer) {
    // Replace the Register/Login buttons with a welcome message and Logout button
    authButtonsContainer.innerHTML = `
      <span style="margin-right: 10px;">Welcome, ${username}</span>
      <button id="logout-btn" style="padding: 6px 12px; border: none; background-color: #ff69b4; color: #fff; border-radius: 4px; cursor: pointer;">Logout</button>
    `;

    // Attach a click handler to the Logout button
    document.getElementById("logout-btn").addEventListener("click", () => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("userId");
      // Redirect to home page (index.html)
      window.location.href = "/";
    });
  }

  // ----------------- Initial Fetch -----------------
  // By default, fetch all cars.
  await fetchAllCars();

  // ----------------- Populate Dropdowns -----------------
  async function populateDropdown(selectId, fieldName) {
    try {
      const response = await fetch("/api/car/cars", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const cars = await response.json();
      const uniqueValues = [...new Set(cars.map((car) => car[fieldName]))].sort();
      const selectEl = document.getElementById(selectId);
      // Clear current options and add default option
      selectEl.innerHTML = `<option value="">--Select ${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}--</option>`;
      uniqueValues.forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        selectEl.appendChild(option);
      });
    } catch (error) {
      console.error(`Error populating dropdown for ${fieldName}:`, error);
    }
  }
  await populateDropdown("make-filter", "make");
  await populateDropdown("type-filter", "type");
  await populateDropdown("year-filter", "year");

  // ----------------- isLoggedIn function -----------------
  function isLoggedIn() {
    return !!sessionStorage.getItem("token");
  }

  // ----------------- Active Filters Object -----------------
  let activeFilters = {};

  // ----------------- Fetch Functions -----------------
  async function fetchAllCars() {
    try {
      const response = await fetch("/api/car/cars", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const cars = await response.json();
      displayCarResults(cars);
      console.log("All cars have been successfully reloaded.");
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  }

  async function fetchAndDisplayCars(filters) {
    let apiUrl = "";
    if (filters.start && filters.end) {
      apiUrl = `/api/booking/cars/available?startDate=${encodeURIComponent(filters.start)}&endDate=${encodeURIComponent(filters.end)}`;
    } else {
      apiUrl = "/api/car/cars";
    }
    const extraParams = [];
    if (filters.make) extraParams.push(`make=${encodeURIComponent(filters.make)}`);
    if (filters.type) extraParams.push(`type=${encodeURIComponent(filters.type)}`);
    if (filters.year) extraParams.push(`year=${encodeURIComponent(filters.year)}`);
    if (filters.minPrice) extraParams.push(`minPrice=${encodeURIComponent(filters.minPrice)}`);
    if (filters.maxPrice) extraParams.push(`maxPrice=${encodeURIComponent(filters.maxPrice)}`);
    if (extraParams.length > 0) {
      apiUrl += apiUrl.indexOf("?") !== -1 ? "&" + extraParams.join("&") : "?" + extraParams.join("&");
    }
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const cars = await response.json();
      displayCarResults(cars);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  }

  // ----------------- Display Function -----------------
  function displayCarResults(cars) {
    carListContainer.innerHTML = "";
    if (!cars || cars.length === 0) {
      carListContainer.innerHTML = `<p style="text-align: center; font-size: 16px;">No cars available for the selected filters.</p>`;
      return;
    }
    cars.forEach((car) => {
      const carItem = document.createElement("div");
      carItem.classList.add("car-item");
      carItem.innerHTML = `
        <img src="${car.image_url || "../assets/images/default-car.jpg"}" alt="${car.make} ${car.model}">
        <div class="car-info">
          <h3>${car.make} ${car.model} ${car.year}</h3>
        </div>
        <div class="car-price">$${car.price_per_day} per day</div>
        <button class="book-btn" data-car-id="${car.id}">Book Now</button>
      `;
      carListContainer.appendChild(carItem);
    });

    // Attach event listeners to the newly created "Book Now" buttons
    attachBookButtonListeners();
  }

  function attachBookButtonListeners() {
    const bookBtns = document.querySelectorAll(".book-btn");

    bookBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const carId = event.target.getAttribute("data-car-id");

        if (!isLoggedIn()) {
          window.location.href = `/login?next=${encodeURIComponent(`/booking-payment?carId=${carId}`)}`;
        } else {
          window.location.href = `/booking-payment?carId=${carId}`;
        }
      });
    });
  }

  // ----------------- Form Submit & Reset Listeners -----------------
  if (filtersForm) {
    filtersForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(filtersForm);
      activeFilters = {
        start: formData.get("start") || null,
        end: formData.get("end") || null,
        make: formData.get("make") || null,
        type: formData.get("type") || null,
        year: formData.get("year") || null,
        minPrice: formData.get("minPrice") || null,
        maxPrice: formData.get("maxPrice") || null,
      };

      if (activeFilters.start && activeFilters.end) {
        if (new Date(activeFilters.start) >= new Date(activeFilters.end)) {
          alert("End date must be after start date.");
          return;
        }
      }
      console.log("Applying filters:", activeFilters);
      await fetchAndDisplayCars(activeFilters);
    });

    filtersForm.addEventListener("reset", async () => {
      activeFilters = {};
      await fetchAllCars();
    });
  }
});
