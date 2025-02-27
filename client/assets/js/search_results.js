document.addEventListener("DOMContentLoaded", function () {
  const allModals = document.querySelectorAll(".modal");
  const filterButtons = document.querySelectorAll("[data-filter]");

  fetchAllCars();// Fetch and display all cars when the page loads


  let selectedMake = null;
  let selectedYear = null;
  let selectedType = null;
  let selectedPrice = null;

  // **Close all modal popups**
  function closeAllModals() {
    allModals.forEach(modal => {
      modal.style.display = "none";
    });
  }

  function resetFilters() {
    document.querySelectorAll("input[type='radio']").forEach(radio => {
      radio.checked = false;
    });

    selectedMake = null;
    selectedYear = null;
    selectedType = null;
    selectedPrice = null;
  }

  // **Reset all selected filters**
  filterButtons.forEach(button => {
    button.addEventListener("click", function (event) {
      closeAllModals();

      const filterType = this.getAttribute("data-filter");
      const modal = document.getElementById(`${filterType}-modal`);

      if (modal) {
        const rect = this.getBoundingClientRect();


        modal.style.position = "absolute";
        modal.style.top = `${rect.bottom + window.scrollY + 10}px`;
        modal.style.left = `${rect.left + window.scrollX}px`;
        modal.style.display = "block";
      }

      event.stopPropagation(); // Prevent immediate closing
    });
  });

  // **Clicking outside should close all modals**
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".filter-select") && !event.target.closest(".modal")) {
      closeAllModals();
    }
  });

  // **Fetch available car makes**
  const makeOptionsContainer = document.getElementById("make-options");
  const makeBtn = document.getElementById("make-filter-btn");

  async function fetchMakes() {
    try {
      closeAllModals();
      const response = await fetch("http://localhost:8080/api/car/cars");
      const cars = await response.json();
      const makes = [...new Set(cars.map(car => car.make))];

      makeOptionsContainer.innerHTML = "";

      makes.forEach(make => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "make";
        input.value = make;

        label.appendChild(input);
        label.appendChild(document.createTextNode(make));
        makeOptionsContainer.appendChild(label);
      });

      // **Position modal below the button**
      const rect = makeBtn.getBoundingClientRect();
      const modal = document.getElementById("make-modal");
      modal.style.position = "absolute";
      modal.style.top = `${rect.bottom + window.scrollY + 250}px`;
      modal.style.left = `${rect.left + window.scrollX}px`;
      modal.style.display = "block";
    } catch (error) {
      console.error("Error fetching makes:", error);
    }
  }

  // **Bind make button to fetch function**
  makeBtn.addEventListener("click", fetchMakes);

  viewMakeResultsBtn.addEventListener("click", function () {
    if (selectedMake) {
      console.log("Filtering cars by make:", selectedMake);

    }
    resetFilters(); // Reset filters after selection
    closeAllModals();
  });



  const typeOptionsContainer = document.getElementById("type-options");
  const typeBtn = document.getElementById("type-filter-btn");


  async function fetchTypes() {
    try {
      closeAllModals();
      const response = await fetch("http://localhost:8080/api/car/cars");
      const cars = await response.json();
      const types = [...new Set(cars.map(car => car.type))];

      typeOptionsContainer.innerHTML = "";

      types.forEach(type => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "type";
        input.value = type;

        label.appendChild(input);
        label.appendChild(document.createTextNode(type.charAt(0).toUpperCase() + type.slice(1)));
        typeOptionsContainer.appendChild(label);
      });


      const rect = typeBtn.getBoundingClientRect();
      const modal = document.getElementById("type-modal");
      modal.style.position = "absolute";
      modal.style.top = `${rect.bottom + window.scrollY + 154}px`;
      modal.style.left = `${rect.left + window.scrollX}px`;
      modal.style.display = "block";
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  }

  // **Apply Filters Button**
  typeBtn.addEventListener("click", fetchTypes);

  viewTypeResultsBtn.addEventListener("click", function () {
    if (selectedType) {
      console.log("Filtering cars by type:", selectedType);
    }
    resetFilters();
    closeAllModals();
  });


  const priceBtn = document.getElementById("price-btn");
  const viewPriceResultsBtn = document.getElementById("view-price-results");

  function showPriceModal() {
    closeAllModals();


    const rect = priceBtn.getBoundingClientRect();
    const modal = document.getElementById("price-modal");
    modal.style.position = "absolute";
    modal.style.top = `${rect.bottom + window.scrollY + 122}px`;
    modal.style.left = `${rect.left + window.scrollX}px`;
    modal.style.display = "block";
  }


  priceBtn.addEventListener("click", showPriceModal);
  viewPriceResultsBtn.addEventListener("click", function () {
    const selectedPrice = document.querySelector("input[name='price-sort']:checked");
    if (selectedPrice) {
      console.log("Sorting cars by price:", selectedPrice.value);
    }
    resetFilters();
    closeAllModals();
  });


  const yearOptionsContainer = document.getElementById("year-options");
  const yearBtn = document.getElementById("year-filter-btn");


  async function fetchYears() {
    try {
      closeAllModals();
      const response = await fetch("http://localhost:8080/api/car/cars");
      const cars = await response.json();
      const years = [...new Set(cars.map(car => Number(car.year)))].sort((a, b) => b - a);


      yearOptionsContainer.innerHTML = "";

      years.forEach(year => {
        const label = document.createElement("label");
        label.classList.add("year-option");

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "year";
        input.value = year;

        label.appendChild(input);
        label.appendChild(document.createTextNode(` ${year}`));
        yearOptionsContainer.appendChild(label);
      });


      const rect = yearBtn.getBoundingClientRect();
      const modal = document.getElementById("year-modal");
      modal.style.position = "absolute";
      modal.style.top = `${rect.bottom + window.scrollY + 148}px`;
      modal.style.left = `${rect.left + window.scrollX}px`;
      modal.style.display = "block";
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  }


  yearBtn.addEventListener("click", fetchYears);

  viewYearResultsBtn.addEventListener("click", function () {
    if (selectedYear) {
      console.log("Filtering cars by year:", selectedYear);
    }
    resetFilters();
    closeAllModals();
  });


  const resetYearBtn = document.getElementById("reset-year");
  resetYearBtn.addEventListener("click", function () {
    document.querySelectorAll("input[name='year']").forEach(radio => {
      radio.checked = false;
    });
  });


  const viewYearResultsBtn = document.getElementById("view-year-results");
  viewYearResultsBtn.addEventListener("click", function () {
    const selectedYear = document.querySelector("input[name='year']:checked");
    if (selectedYear) {
      console.log("Filtering by Year:", selectedYear.value);

    }
    document.getElementById("year-modal").style.display = "none"; // 关闭弹窗
  });

});



const carListContainer = document.getElementById("car-list");
const viewMakeResultsBtn = document.getElementById("view-make-results");
const viewTypeResultsBtn = document.getElementById("view-type-results");
const viewYearResultsBtn = document.getElementById("view-year-results");
const viewPriceResultsBtn = document.getElementById("view-price-results");

const resetMakeBtn = document.getElementById("reset-make");
const resetTypeBtn = document.getElementById("reset-type");
const resetYearBtn = document.getElementById("reset-year");
const resetPriceBtn = document.getElementById("reset-price");


let selectedFilters = {
  make: null,
  type: null,
  year: null,
  price: null
};


async function fetchAndDisplayCars() {
  try {
    const response = await fetch("http://localhost:8080/api/car/cars");
    const cars = await response.json();


    let filteredCars = cars.filter(car => {
      return (
        (!selectedFilters.make || car.make.trim().toLowerCase() === selectedFilters.make.trim().toLowerCase()) &&
        (!selectedFilters.type || car.type.trim().toLowerCase() === selectedFilters.type.trim().toLowerCase()) &&
        (!selectedFilters.year || car.year == selectedFilters.year) &&
        (!selectedFilters.price || (selectedFilters.price === "asc" ? true : true)) // 价格排序稍后处理
      );
    });


    if (selectedFilters.price === "asc") {
      filteredCars.sort((a, b) => a.price_per_day - b.price_per_day);
    } else if (selectedFilters.price === "desc") {
      filteredCars.sort((a, b) => b.price_per_day - a.price_per_day);
    }


    carListContainer.innerHTML = "";


    if (filteredCars.length === 0) {
      carListContainer.innerHTML = `<p style="text-align: center; font-size: 16px;">No cars found.</p>`;
      return;
    }


    filteredCars.forEach(car => {
      const carItem = document.createElement("div");
      carItem.classList.add("car-item");

      carItem.innerHTML = `
  <img src="${car.image_url || 'default-car.jpg'}" alt="${car.make} ${car.model}">
  <div class="car-info">
    <h3>${car.make} ${car.model} ${car.year}</h3>
  </div>
  <div class="car-price">$${car.price_per_day} per day</div>
`;


      carListContainer.appendChild(carItem);
    });

  } catch (error) {
    console.error("Error fetching cars:", error);
  }
}



viewMakeResultsBtn.addEventListener("click", () => {
  const selectedMake = document.querySelector("input[name='make']:checked");
  selectedFilters.make = selectedMake ? selectedMake.value : null;
  fetchAndDisplayCars();
});

viewTypeResultsBtn.addEventListener("click", () => {
  const selectedType = document.querySelector("input[name='type']:checked");
  selectedFilters.type = selectedType ? selectedType.value : null;
  fetchAndDisplayCars();
});

viewYearResultsBtn.addEventListener("click", () => {
  const selectedYear = document.querySelector("input[name='year']:checked");
  selectedFilters.year = selectedYear ? selectedYear.value : null;
  fetchAndDisplayCars();
});

viewPriceResultsBtn.addEventListener("click", () => {
  const selectedPrice = document.querySelector("input[name='price-sort']:checked");
  selectedFilters.price = selectedPrice ? selectedPrice.value : null;
  fetchAndDisplayCars();
});


resetMakeBtn.addEventListener("click", () => {
  selectedFilters.make = null;
  document.querySelectorAll("input[name='make']").forEach(input => (input.checked = false));
  carListContainer.innerHTML = "";
});

resetTypeBtn.addEventListener("click", () => {
  selectedFilters.type = null;
  document.querySelectorAll("input[name='type']").forEach(input => (input.checked = false));
  carListContainer.innerHTML = "";
});

resetYearBtn.addEventListener("click", () => {
  selectedFilters.year = null;
  document.querySelectorAll("input[name='year']").forEach(input => (input.checked = false));
  carListContainer.innerHTML = "";
});

resetPriceBtn.addEventListener("click", () => {
  selectedFilters.price = null;
  document.querySelectorAll("input[name='price-sort']").forEach(input => (input.checked = false));
  carListContainer.innerHTML = "";
});


const viewResultsButtons = document.querySelectorAll(".view-btn");

viewResultsButtons.forEach(button => {
  button.addEventListener("click", function () {

    const modal = this.closest(".modal");


    fetchAndDisplayCars();


    modal.style.display = "none";
  });
});


const resetAllFiltersBtn = document.getElementById("resetall-filters");


resetAllFiltersBtn.addEventListener("click", function () {
  console.log("Resetting all filters...");


  document.querySelectorAll("input[type='radio']").forEach(input => {
    input.checked = false;
  });


  selectedFilters = {
    make: null,
    year: null,
    type: null,
    price: null
  };


  carListContainer.innerHTML = "";



  console.log("All filters have been successfully reset.");
});


async function fetchAllCars() {
  try {
    const response = await fetch("http://localhost:8080/api/car/cars");
    const cars = await response.json();


    carListContainer.innerHTML = "";


    cars.forEach(car => {
      const carItem = document.createElement("div");
      carItem.classList.add("car-item");

      carItem.innerHTML = `
  <img src="${car.image_url || 'default-car.jpg'}" alt="${car.make} ${car.model}" class="car-image">
  <div class="car-info">
    <h3>${car.make} ${car.model}, ${car.year}</h3>
    </div>
<div class="car-price">$${car.price_per_day} per day</div>
`;


      carListContainer.appendChild(carItem);
    });

    console.log("All cars have been successfully reloaded.");
  } catch (error) {
    console.error("Error fetching cars:", error);
  }
}
