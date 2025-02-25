document.addEventListener("DOMContentLoaded", function () {
  const allModals = document.querySelectorAll(".modal");
  const filterButtons = document.querySelectorAll("[data-filter]");


  let selectedMake = null;
  let selectedYear = null;
  let selectedType = null;
  let selectedPrice = null;

  // **关闭所有弹窗**
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

  // **监听所有 `Filter` 按钮**
  filterButtons.forEach(button => {
    button.addEventListener("click", function (event) {
      closeAllModals(); // 先关闭所有弹窗

      const filterType = this.getAttribute("data-filter");
      const modal = document.getElementById(`${filterType}-modal`);

      if (modal) {
        const rect = this.getBoundingClientRect(); // 获取按钮位置

        // **修正：确保 modal 出现在按钮正下方**
        modal.style.position = "absolute";
        modal.style.top = `${rect.bottom + window.scrollY + 10}px`; // 调整弹窗和按钮的距离
        modal.style.left = `${rect.left + window.scrollX}px`;
        modal.style.display = "block";
      }

      event.stopPropagation(); // 阻止冒泡，防止立即关闭
    });
  });

  // **点击页面空白处关闭所有弹窗**
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".filter-select") && !event.target.closest(".modal")) {
      closeAllModals();
    }
  });

  // ======== **绑定 `Make` 过滤数据** ========
  const makeOptionsContainer = document.getElementById("make-options");
  const makeBtn = document.getElementById("make-filter-btn");

  async function fetchMakes() {
    try {
      closeAllModals(); // 先关闭所有其他弹窗
      const response = await fetch("http://localhost:8088/api/cars");
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

      // **让 `modal` 出现在 `make` 按钮下方**
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

  // 绑定 `Make` 按钮点击事件
  makeBtn.addEventListener("click", fetchMakes);

  viewMakeResultsBtn.addEventListener("click", function () {
    if (selectedMake) {
      console.log("Filtering cars by make:", selectedMake);
      // 触发 API 请求，根据 selectedMake 筛选车辆
    }
    resetFilters(); // **重置筛选**
    closeAllModals();
  });


  // ======== **绑定 `Type` 过滤数据** ========
  const typeOptionsContainer = document.getElementById("type-options");
  const typeBtn = document.getElementById("type-filter-btn");


  async function fetchTypes() {
    try {
      closeAllModals();
      const response = await fetch("http://localhost:8088/api/cars");
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

      // **让 `modal` 出现在 `type` 按钮下方**
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

  // 绑定 `Type` 按钮点击事件
  typeBtn.addEventListener("click", fetchTypes);

  viewTypeResultsBtn.addEventListener("click", function () {
    if (selectedType) {
      console.log("Filtering cars by type:", selectedType);
    }
    resetFilters();
    closeAllModals();
  });

  // ======== **绑定 `Price` 过滤数据** ========
  const priceBtn = document.getElementById("price-btn");
  const viewPriceResultsBtn = document.getElementById("view-price-results");

  function showPriceModal() {
    closeAllModals();

    // **让 `modal` 出现在 `Price` 按钮下方**
    const rect = priceBtn.getBoundingClientRect();
    const modal = document.getElementById("price-modal");
    modal.style.position = "absolute";
    modal.style.top = `${rect.bottom + window.scrollY + 122}px`;
    modal.style.left = `${rect.left + window.scrollX}px`;
    modal.style.display = "block";
  }

  // 绑定 `Price` 按钮点击事件
  priceBtn.addEventListener("click", showPriceModal);
  viewPriceResultsBtn.addEventListener("click", function () {
    const selectedPrice = document.querySelector("input[name='price-sort']:checked");
    if (selectedPrice) {
      console.log("Sorting cars by price:", selectedPrice.value);
    }
    resetFilters();
    closeAllModals();
  });

  // ======== **绑定 `Year` 过滤数据**（新增功能） ========
  const yearOptionsContainer = document.getElementById("year-options");
  const yearBtn = document.getElementById("year-filter-btn");


  async function fetchYears() {
    try {
      closeAllModals(); // 先关闭所有其他弹窗
      const response = await fetch("http://localhost:8088/api/cars");
      const cars = await response.json();
      const years = [...new Set(cars.map(car => Number(car.year)))].sort((a, b) => b - a);
      // 获取所有唯一年份并按降序排列

      yearOptionsContainer.innerHTML = ""; // 清空旧数据

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

      // **让 `modal` 出现在 `year` 按钮下方**
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

  // 绑定 `Year` 按钮点击事件
  yearBtn.addEventListener("click", fetchYears);

  viewYearResultsBtn.addEventListener("click", function () {
    if (selectedYear) {
      console.log("Filtering cars by year:", selectedYear);
    }
    resetFilters();
    closeAllModals();
  });

  // **绑定 Reset 按钮**
  const resetYearBtn = document.getElementById("reset-year");
  resetYearBtn.addEventListener("click", function () {
    document.querySelectorAll("input[name='year']").forEach(radio => {
      radio.checked = false;
    });
  });

  // **绑定 View Results 按钮**
  const viewYearResultsBtn = document.getElementById("view-year-results");
  viewYearResultsBtn.addEventListener("click", function () {
    const selectedYear = document.querySelector("input[name='year']:checked");
    if (selectedYear) {
      console.log("Filtering by Year:", selectedYear.value);
      // 这里可以发送 API 请求，获取按年份筛选的车辆数据
    }
    document.getElementById("year-modal").style.display = "none"; // 关闭弹窗
  });

});


// 获取元素
const carListContainer = document.getElementById("car-list");
const viewMakeResultsBtn = document.getElementById("view-make-results");
const viewTypeResultsBtn = document.getElementById("view-type-results");
const viewYearResultsBtn = document.getElementById("view-year-results");
const viewPriceResultsBtn = document.getElementById("view-price-results");

const resetMakeBtn = document.getElementById("reset-make");
const resetTypeBtn = document.getElementById("reset-type");
const resetYearBtn = document.getElementById("reset-year");
const resetPriceBtn = document.getElementById("reset-price");

// 记录用户的筛选条件
let selectedFilters = {
  make: null,
  type: null,
  year: null,
  price: null
};

// ** 获取并展示筛选结果 **
async function fetchAndDisplayCars() {
  try {
    const response = await fetch("http://localhost:8088/api/cars");
    const cars = await response.json();

    // **处理筛选条件**
    let filteredCars = cars.filter(car => {
      return (
        (!selectedFilters.make || car.make.trim().toLowerCase() === selectedFilters.make.trim().toLowerCase()) &&
        (!selectedFilters.type || car.type.trim().toLowerCase() === selectedFilters.type.trim().toLowerCase()) &&
        (!selectedFilters.year || car.year == selectedFilters.year) &&
        (!selectedFilters.price || (selectedFilters.price === "asc" ? true : true)) // 价格排序稍后处理
      );
    });

    // **价格排序**
    if (selectedFilters.price === "asc") {
      filteredCars.sort((a, b) => a.price_per_day - b.price_per_day);
    } else if (selectedFilters.price === "desc") {
      filteredCars.sort((a, b) => b.price_per_day - a.price_per_day);
    }

    // **清空之前的列表**
    carListContainer.innerHTML = "";

    // **如果没有符合筛选的车辆**
    if (filteredCars.length === 0) {
      carListContainer.innerHTML = `<p style="text-align: center; font-size: 16px;">No cars found.</p>`;
      return;
    }

    // **插入新列表**
    filteredCars.forEach(car => {
      const carItem = document.createElement("div");
      carItem.classList.add("car-item");

      carItem.innerHTML = `
        <img src="${car.image_url}" alt="${car.make} ${car.model}">
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


// **绑定 "View Results" 按钮**
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

// **绑定 "Reset" 按钮**
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

// 🚀 获取所有 View Results 按钮
const viewResultsButtons = document.querySelectorAll(".view-btn");

viewResultsButtons.forEach(button => {
  button.addEventListener("click", function () {
    // 获取当前 modal
    const modal = this.closest(".modal");

    // 触发筛选数据
    fetchAndDisplayCars();

    // **自动关闭 modal**
    modal.style.display = "none";
  });
});

// ======== **全局 Reset 逻辑** ========
// 获取 `Reset All Filters` 按钮
const resetAllFiltersBtn = document.getElementById("resetall-filters");

// **🚀 绑定 `Reset All Filters` 按钮事件**
resetAllFiltersBtn.addEventListener("click", function () {
  console.log("Resetting all filters...");

  // **1️⃣ 清空所有 `radio` 选项**
  document.querySelectorAll("input[type='radio']").forEach(input => {
    input.checked = false;
  });

  // **2️⃣ 清空所有 JavaScript 变量**
  selectedFilters = {
    make: null,
    year: null,
    type: null,
    price: null
  };

  // **3️⃣ 清空车辆列表**
  carListContainer.innerHTML = "";



  console.log("All filters have been successfully reset.");
});

/**
 * **🚗 重新获取所有车辆数据**
 * **作用：** 让 `Reset` 按钮恢复到**最初未筛选的状态**，并重新获取所有的车辆数据。
 */
async function fetchAllCars() {
  try {
    const response = await fetch("http://localhost:8088/api/cars");
    const cars = await response.json();

    // 清空车辆列表
    carListContainer.innerHTML = "";

    // 遍历获取的车辆数据并插入 HTML
    cars.forEach(car => {
      const carItem = document.createElement("div");
      carItem.classList.add("car-item");

      carItem.innerHTML = `
                <img src="${car.image || 'default-car.jpg'}" alt="${car.make} ${car.model}">
                <div class="car-info">
                    <h3>${car.make} ${car.model}, ${car.year}</h3>
                    <p class="price">$${car.price_per_day} / day</p>
                </div>
            `;

      carListContainer.appendChild(carItem);
    });

    console.log("All cars have been successfully reloaded.");
  } catch (error) {
    console.error("Error fetching cars:", error);
  }
}
