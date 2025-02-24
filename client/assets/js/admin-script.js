/**
 * Event listener for the "Manage Cars" button.
 * Displays the car list and actions while hiding other sections.
 */
document.getElementById('manage-cars').addEventListener('click', () => {
  document.getElementById('car-list').style.display = 'block';
  document.getElementById('car-actions').style.display = 'block';
  document.getElementById('booking-list').style.display = 'none';
  document.getElementById('customer-list').style.display = 'none';

  // Fetch and render the latest car data
  fetchCars();

  // Reset the selected car
  selectedCarId = null;

  // Disable "Update" and "Delete" buttons until a car is selected
  document.getElementById('update-car').disabled = true;
  document.getElementById('delete-car').disabled = true;
});

/**
 * Selected car ID (null if no car is selected).
 * @type {number|null}
 */
let selectedCarId = null;

/**
 * Array holding the list of cars.
 * @type {Array<Object>}
 */
const carList = [];

/**
 * Fetches car data from the API and updates the car list.
 */
function fetchCars() {
  fetch('http://localhost:8088/api/cars')
    .then(response => response.json())
    .then(data => {
      carList.length = 0; // Clear the car array
      carList.push(...data); // Refill the array with new data
      updateCarList(); // Update the UI with the new car list
    })
    .catch(error => {
      console.error('Error fetching cars:', error);
    });
}

/**
 * Updates the UI to display the latest car data.
 */
function updateCarList() {
  console.log("Updated car list:", carList); // Log the updated car list for debugging
  const carTable = document.getElementById('car-table');
  carTable.innerHTML = ''; // Clear the table content

  // Create and append the table header
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>Select</th>
    <th>ID</th>
    <th>Make</th>
    <th>Model</th>
    <th>Year</th>
    <th>Price Per Day</th>
    <th>Status</th>
    <th>Type</th>
  `;
  carTable.appendChild(headerRow);

  // Create and append a row for each car in the list
  carList.forEach((car, index) => {
    const row = document.createElement('tr');
    const radioCell = document.createElement('td');
    const idCell = document.createElement('td');
    const makeCell = document.createElement('td');
    const modelCell = document.createElement('td');
    const yearCell = document.createElement('td');
    const priceCell = document.createElement('td');
    const statusCell = document.createElement('td');
    const typeCell = document.createElement('td');

    // Create a radio button to select this car
    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.name = 'car-select';
    radioButton.addEventListener('click', () => selectCar(index));

    radioCell.appendChild(radioButton);
    idCell.textContent = car.id;
    makeCell.textContent = car.make;
    modelCell.textContent = car.model;
    yearCell.textContent = car.year;
    priceCell.textContent = `$${car.price_per_day}`;
    statusCell.textContent = car.status;
    typeCell.textContent = car.type;

    row.appendChild(radioCell);
    row.appendChild(idCell);
    row.appendChild(makeCell);
    row.appendChild(modelCell);
    row.appendChild(yearCell);
    row.appendChild(priceCell);
    row.appendChild(statusCell);
    row.appendChild(typeCell);
    carTable.appendChild(row);
  });

  // Update the total cars count in the UI
  document.getElementById('total-cars').querySelector('p').textContent = carList.length;
}

/**
 * Sets the selected car index and enables the "Update" and "Delete" buttons.
 * @param {number} index - The index of the selected car in `carList`.
 */
function selectCar(index) {
  selectedCarId = index;
  document.getElementById('update-car').disabled = false;
  document.getElementById('delete-car').disabled = false;
}



/**
 * Event listener for the "Add Car" button.
 * Displays the add/update car form and overlay.
 */
document.getElementById('add-car').addEventListener('click', () => {

  selectedCarId = null;

  // Display the add/update form and overlay
  document.getElementById('car-form').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';

  // Reset the form fields and any error messages
  resetCarForm();

  // Hide the ID field and its label (for new car entry)
  document.getElementById('car-id').style.display = 'none';
  document.querySelector('label[for="car-id"]').style.display = 'none';
});

/**
 * Event listener for the "Cancel" button inside the car actions section.
 * Hides the car list, actions, form, and overlay.
 */
document.getElementById('cancel-car').addEventListener('click', () => {
  // Hide the car list, actions, form, and overlay
  document.getElementById('car-list').style.display = 'none';
  document.getElementById('car-actions').style.display = 'none';
  document.getElementById('car-form').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';

  resetCarForm();      // Reset form fields
  clearErrorMessages(); // Clear any displayed error messages
});

/**
 * Removes all error messages from the form.
 */
function clearErrorMessages() {
  document.querySelectorAll('.error-message').forEach(el => el.remove());
}

/**
 * Resets all fields in the car form to their default values.
 */
function resetCarForm() {
  document.getElementById('car-id').value = '';      // Clear the ID field
  document.getElementById('car-make').value = '';      // Clear the Make field
  document.getElementById('car-model').value = '';     // Clear the Model field
  document.getElementById('car-year').value = '';      // Clear the Year field
  document.getElementById('car-price').value = '';     // Clear the Price field
  document.getElementById('car-type').value = '';      // Clear the Type field

  // Hide the ID input field and its label
  document.getElementById('car-id').style.display = 'none';
  document.querySelector('label[for="car-id"]').style.display = 'none';

  // Enable the "Add" button and disable "Update" and "Delete" buttons
  document.getElementById('add-car').disabled = false;
  document.getElementById('update-car').disabled = true;
  document.getElementById('delete-car').disabled = true;
}

/**
 * Event listener for the "Update Car" button.
 * Fills the form with selected car details and displays it.
 */
document.getElementById('update-car').addEventListener('click', () => {
  clearErrorMessages();
  const car = carList[selectedCarId];
  document.getElementById('car-id').value = car.id;        // Populate the ID field
  document.getElementById('car-make').value = car.make;
  document.getElementById('car-model').value = car.model;
  document.getElementById('car-year').value = car.year;
  document.getElementById('car-price').value = car.price_per_day;
  document.getElementById('car-type').value = car.type;
  document.getElementById('car-status').value = car.status;

  // Show the ID field and make it read-only (since ID should not be modified)
  document.querySelector('label[for="car-id"]').style.display = 'block';
  document.getElementById('car-id').style.display = 'block';
  document.getElementById('car-id').readOnly = true;

  // Display the form and overlay for updating the car details
  document.getElementById('car-form').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
});

/**
 * Event listener for the "Delete Car" button.
 * Confirms and deletes the selected car from the database.
 */
document.getElementById('delete-car').addEventListener('click', () => {
  // Confirm deletion of the selected car
  const confirmDelete = confirm('Are you sure you want to delete this car?');
  if (confirmDelete) {
    fetch(`http://localhost:8088/api/cars/${carList[selectedCarId].id}`, {
      method: 'DELETE'
    })
      .then(() => {
        // Remove the car from the array and update the UI
        carList.splice(selectedCarId, 1);
        alert('Car deleted successfully');
        updateCarList();
      })
      .catch(error => {
        console.error('Error deleting car:', error);
      });
  }
});

// Event listener for "Cancel" button in the form
document.getElementById('cancel-form').addEventListener('click', () => {
  // Hide the form and overlay, and show the car list and actions
  document.getElementById('car-form').style.display = 'none';
  document.getElementById('car-actions').style.display = 'block';
  document.getElementById('car-list').style.display = 'block';
  document.getElementById('overlay').style.display = 'none';

  resetCarForm();       // Reset form fields
  clearErrorMessages(); // Clear any error messages

  selectedCarId = null; // Reset selected car index
  // Uncheck all radio buttons in the car list
  document.querySelectorAll('input[name="car-select"]').forEach(radio => {
    radio.checked = false;
  });
});

// Close the form and overlay when clicking on the overlay background
document.getElementById('overlay').addEventListener('click', () => {
  document.getElementById('car-form').style.display = 'none';
  document.getElementById('car-actions').style.display = 'block';
  document.getElementById('car-list').style.display = 'block';
  document.getElementById('overlay').style.display = 'none';
});

/**
 * Event listener for submitting the car form (both for adding and updating cars).
 * Prevents default form submission and validates input data before sending it to the server.
 * @param {Event} event - The form submission event.
 */
document.getElementById('submit-car').addEventListener('click', (event) => {
  event.preventDefault(); // 阻止默认提交

  // 获取输入值
  const make = document.getElementById('car-make').value.trim();
  const model = document.getElementById('car-model').value.trim();
  const year = document.getElementById('car-year').value.trim();
  const price = document.getElementById('car-price').value.trim();
  const type = document.getElementById('car-type').value.trim();
  const status = document.getElementById('car-status').value;

  // 获取当前年份
  const currentYear = new Date().getFullYear();

  // 清除所有之前的错误信息
  document.querySelectorAll('.error-message').forEach(el => el.remove());

  let isValid = true;

  // 验证 Make
  if (!make) {
    showError('car-make', 'Make is required.');
    isValid = false;
  } else if (!/^[A-Za-z0-9\s\-]+$/.test(make)) {
    showError('car-make', 'Make must be a valid string containing letters, numbers, or dashes.');
    isValid = false;
  }

  // 验证 Model
  if (!model) {
    showError('car-model', 'Model is required.');
    isValid = false;
  } else if (!/^[A-Za-z0-9\s\-]+$/.test(model)) {
    showError('car-model', 'Model must be a valid string containing letters, numbers, or dashes.');
    isValid = false;
  }

  // 验证 Year
  if (!year) {
    showError('car-year', 'Year is required.');
    isValid = false;
  } else if (!/^\d{4}$/.test(year)) {
    showError('car-year', 'Year must be a 4-digit number.');
    isValid = false;
  } else if (year < 1900 || year > currentYear) {
    showError('car-year', `Year must be between 1900 and ${currentYear}.`);
    isValid = false;
  }

  // 验证 Price Per Day
  if (!price) {
    showError('car-price', 'Price per day is required.');
    isValid = false;
  } else if (isNaN(price) || price <= 0) {
    showError('car-price', 'Price per day must be a positive number.');
    isValid = false;
  }

  // 验证 Type
  if (!type) {
    showError('car-type', 'Type is required.');
    isValid = false;
  } else if (!/^[A-Za-z0-9\s\-]+$/.test(type)) {
    showError('car-type', 'Type must be a valid string containing letters, numbers, or dashes.');
    isValid = false;
  }

  // 只有在所有验证通过时才提交表单
  if (isValid) {
    const carData = {
      make,
      model,
      year,
      price_per_day: price,
      status: status,
      type
    };

    if (selectedCarId === null) {
      // 添加新车辆 (POST)
      fetch('http://localhost:8088/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(carData)
      })
        .then(response => response.json())
        .then(result => {
          // 如果返回结果中有 car 属性，则提取实际数据，否则直接使用返回结果
          const newCar = result.car ? result.car : result;
          carList.push(newCar); // 将新车添加到数组中，新车会出现在数组的最后一项
          alert('Car added successfully');
          updateCarList(); // 重新渲染车辆列表，立即显示新添加的车辆
        })
        .catch(error => {
          console.error('Error adding car:', error);
        });
    } else {
      // 更新车辆 (PUT)
      fetch(`http://localhost:8088/api/cars/${carList[selectedCarId].id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(carData)
      })
        .then(response => response.json())
        .then(result => {
          const updatedCar = result.car ? result.car : result;
          carList[selectedCarId] = updatedCar;
          alert('Car updated successfully');
          updateCarList();
        })
        .catch(error => {
          console.error('Error updating car:', error);
        });
    }

    // 关闭表单和 overlay
    document.getElementById('car-form').style.display = 'none';
    document.getElementById('car-actions').style.display = 'block';
    document.getElementById('overlay').style.display = 'none';
  }
});



/**
 * Displays an error message next to a form field.
 * @param {string} inputId - The ID of the input field.
 * @param {string} message - The error message to display.
 */
function showError(inputId, message) {
  const inputField = document.getElementById(inputId);
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  errorMessage.style.color = 'red';
  errorMessage.style.fontSize = '12px';
  errorMessage.style.marginTop = '5px';
  errorMessage.textContent = message;
  inputField.parentNode.insertBefore(errorMessage, inputField.nextSibling);
}



/**
 * Global variables for managing bookings.
 * @type {number|null}
 */
let selectedBookingId = null;

/**
 * Array storing the list of bookings.
 * @type {Array<Object>}
 */
const bookingList = [];

/**
 * Event listener for "Manage Bookings" button.
 * Displays the booking list and hides other sections.
 */
document.getElementById('manage-bookings').addEventListener('click', () => {
  document.getElementById('booking-list').style.display = 'block';
  document.getElementById('car-list').style.display = 'none';
  document.getElementById('customer-list').style.display = 'none';

  // Fetch and render the booking list
  fetchBookings();

  // Reset selected booking
  selectedBookingId = null;
  document.getElementById('cancel-booking').disabled = true;
});

// Filter button: When clicked, re-fetch the filtered data
document.getElementById('filter-bookings').addEventListener('click', () => {
  fetchBookings();
});

/**
 * Fetches booking data from the API and applies filters.
 */
function fetchBookings() {
  fetch('http://localhost:8088/api/orders')
    .then(response => response.json())
    .then(data => {
      bookingList.length = 0; // Clear the existing booking array
      bookingList.push(...data); // Populate with new data

      // Filter booking data based on dropdown selection
      const period = document.getElementById('booking-period').value;
      let filteredBookings = bookingList;
      if (period) {
        const today = new Date();
        let filterDate;
        if (period === 'week') {
          filterDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (period === 'month') {
          filterDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        } else if (period === 'year') {
          filterDate = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
        }
        filteredBookings = bookingList.filter(booking => {
          const startDate = new Date(booking.start_date);
          return startDate >= filterDate;
        });
      }

      updateBookingList(filteredBookings);
      // Update the "Total Bookings" count
      document.getElementById('total-bookings').querySelector('p').textContent = filteredBookings.length;
    })
    .catch(error => {
      console.error('Error fetching bookings:', error);
    });
}

// Render the booking list; parameter `bookings` is the filtered array (if omitted, uses `bookingList`)
function updateBookingList(bookings) {
  const list = bookings || bookingList;
  const bookingTable = document.getElementById('booking-table');
  bookingTable.innerHTML = ''; // Clear table content

  // Add table headers
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>Select</th>
    <th>ID</th>
    <th>User ID</th>
    <th>Car ID</th>
    <th>Start Date</th>
    <th>End Date</th>
    <th>Total Amount</th>
    <th>Status</th>
    <th>Payment Status</th>
    <th>Created At</th>
    <th>Updated At</th>
  `;
  bookingTable.appendChild(headerRow);

  // Populate the table with booking data
  list.forEach((booking, index) => {
    const row = document.createElement('tr');

    const radioCell = document.createElement('td');
    const idCell = document.createElement('td');
    const userIdCell = document.createElement('td');
    const carIdCell = document.createElement('td');
    const startDateCell = document.createElement('td');
    const endDateCell = document.createElement('td');
    const totalAmountCell = document.createElement('td');
    const statusCell = document.createElement('td');
    const paymentStatusCell = document.createElement('td');
    const createdAtCell = document.createElement('td');
    const updatedAtCell = document.createElement('td');

    // Create a radio button for selecting a booking
    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.name = 'booking-select';
    radioButton.addEventListener('click', () => selectBooking(index));

    radioCell.appendChild(radioButton);
    idCell.textContent = booking.id;
    userIdCell.textContent = booking.user_id;
    carIdCell.textContent = booking.car_id;
    startDateCell.textContent = formatDate(booking.start_date);
    endDateCell.textContent = formatDate(booking.end_date);
    totalAmountCell.textContent = `$${booking.total_amount}`;
    statusCell.textContent = booking.status;
    paymentStatusCell.textContent = booking.payment_status;
    createdAtCell.textContent = formatDate(booking.created_at);
    updatedAtCell.textContent = formatDate(booking.updated_at);

    row.appendChild(radioCell);
    row.appendChild(idCell);
    row.appendChild(userIdCell);
    row.appendChild(carIdCell);
    row.appendChild(startDateCell);
    row.appendChild(endDateCell);
    row.appendChild(totalAmountCell);
    row.appendChild(statusCell);
    row.appendChild(paymentStatusCell);
    row.appendChild(createdAtCell);
    row.appendChild(updatedAtCell);

    bookingTable.appendChild(row);
  });

  // Update the "Total Bookings" count
  document.getElementById('total-bookings').querySelector('p').textContent = list.length;
}


/**
 * Selects a booking entry and enables the "Cancel Booking" button.
 * @param {number} index - The index of the selected booking in `bookingList`.
 */
function selectBooking(index) {
  selectedBookingId = index;
  document.getElementById('cancel-booking').disabled = false;
}

/**
 * Event listener for the "Cancel Booking" button.
 * Cancels a selected booking if it has not started or been completed.
 */
document.getElementById('cancel-booking').addEventListener('click', async () => {
  // Get the selected booking
  const booking = bookingList[selectedBookingId];
  if (!booking) {
    alert('No booking selected.');
    return;
  }

  // Convert the start and end dates to Date objects
  const today = new Date();
  const startDate = new Date(booking.start_date);
  const endDate = new Date(booking.end_date);

  // Check if the booking is currently active
  if (today >= startDate && today <= endDate) {
    alert('Order is in progress and cannot be cancelled.');
    return;
  }
  // If the booking is completed, prevent cancellation
  if (today > endDate) {
    alert('Order has been completed and cannot be cancelled.');
    return;
  }

  const confirmCancel = confirm('Are you sure you want to cancel this booking?');
  if (!confirmCancel) return;

  try {
    const response = await fetch(`http://localhost:8088/api/orders/${booking.id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      // Remove the canceled booking from the list
      bookingList.splice(selectedBookingId, 1);
      alert('Booking canceled successfully');
      updateBookingList(bookingList);
      document.getElementById('total-bookings').querySelector('p').textContent = bookingList.length;
    } else {
      const errorData = await response.json();
      alert(`Failed to cancel booking: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Error deleting booking:', error);
    alert('An error occurred while deleting the booking.');
  }
});


/**
 * Event listener for the "Manage Customers" button.
 * Displays the customer list and hides other sections.
 */
document.getElementById('manage-customers').addEventListener('click', () => {
  // Show the customer list section and hide other sections
  document.getElementById('customer-list').style.display = 'block';
  document.getElementById('car-list').style.display = 'none';
  document.getElementById('booking-list').style.display = 'none';

  // Fetch customer data and update the list
  fetchCustomers();

  // Reset selected customer
  selectedCustomerId = null;
  document.getElementById('delete-customer').disabled = true;
});

/**
 * Selected customer ID (null if no customer is selected).
 * @type {number|null}
 */
let selectedCustomerId = null;

/**
 * Array holding the list of customers.
 * @type {Array<Object>}
 */
const customerList = [];

/**
 * Fetches customer data from the API and updates the customer list.
 */
function fetchCustomers() {
  fetch('http://localhost:8088/api/customers')
    .then(response => response.json())
    .then(data => {
      customerList.length = 0; // Clear the array
      customerList.push(...data); // Refill with new data
      updateCustomerList(); // Update the customer list on the page

      // Update "Total Customers" count (assuming <p> tag is inside Total Customers section)
      document.getElementById('total-customers').querySelector('p').textContent = customerList.length;
    })
    .catch(error => {
      console.error('Error fetching customers:', error);
    });
}

/**
 * Updates the UI to display the latest customer data.
 */
function updateCustomerList() {
  const customerTable = document.getElementById('customer-table');
  customerTable.innerHTML = ''; // Clear table content

  // Add table header
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>Select</th>
    <th>ID</th>
    <th>Username</th>
    <th>Email</th>
    <th>Phone</th>
    <th>Created At</th>
    <th>Updated At</th>
  `;
  customerTable.appendChild(headerRow);

  // Populate table with customer data
  customerList.forEach((customer, index) => {
    const row = document.createElement('tr');
    const radioCell = document.createElement('td');
    const idCell = document.createElement('td');
    const usernameCell = document.createElement('td');
    const emailCell = document.createElement('td');
    const phoneCell = document.createElement('td');
    const createdAtCell = document.createElement('td');
    const updatedAtCell = document.createElement('td');

    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.name = 'customer-select';
    radioButton.addEventListener('click', () => selectCustomer(index));

    radioCell.appendChild(radioButton);
    idCell.textContent = customer.id;
    usernameCell.textContent = customer.username;
    emailCell.textContent = customer.email;
    phoneCell.textContent = customer.phone;
    createdAtCell.textContent = formatDate(customer.created_at);
    updatedAtCell.textContent = formatDate(customer.updated_at);

    row.appendChild(radioCell);
    row.appendChild(idCell);
    row.appendChild(usernameCell);
    row.appendChild(emailCell);
    row.appendChild(phoneCell);
    row.appendChild(createdAtCell);
    row.appendChild(updatedAtCell);

    customerTable.appendChild(row);
  });
}

/**
 * Selects a customer entry and enables the "Delete Customer" button.
 * @param {number} index - The index of the selected customer in `customerList`.
 */
function selectCustomer(index) {
  selectedCustomerId = index;
  document.getElementById('delete-customer').disabled = false;
}

/**
 * Event listener for the "Delete Customer" button.
 * Confirms and deletes the selected customer from the database.
 */
document.getElementById('delete-customer').addEventListener('click', async () => {
  const confirmDelete = confirm('Are you sure you want to delete this customer?');
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:8088/api/customers/${customerList[selectedCustomerId].id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      customerList.splice(selectedCustomerId, 1);
      alert('Customer deleted successfully');
      updateCustomerList();
      document.getElementById('total-customers').querySelector('p').textContent = customerList.length;
    } else {
      const errorData = await response.json();
      alert(`Failed to delete customer: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Error deleting customer:', error);
    alert('An error occurred while deleting the customer.');
  }
});

/**
 * Formats a date string as "yyyy-mm-dd".
 * @param {string} dateStr - The date string to format.
 * @returns {string} The formatted date.
 */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toISOString().slice(0, 10);
}

// Update summary-card data when the page loads
window.addEventListener('load', updateSummaryCounts);

function updateSummaryCounts() {
  // Fetch the total number of cars
  fetch('http://localhost:8088/api/cars')
    .then(response => response.json())
    .then(data => {
      // Assuming the response is an array
      document.getElementById('total-cars').querySelector('p').textContent = data.length;
    })
    .catch(error => {
      console.error('Error fetching cars count:', error);
    });

  // Fetch the total number of bookings
  fetch('http://localhost:8088/api/orders')
    .then(response => response.json())
    .then(data => {
      document.getElementById('total-bookings').querySelector('p').textContent = data.length;
    })
    .catch(error => {
      console.error('Error fetching bookings count:', error);
    });

  // Fetch the total number of customers
  fetch('http://localhost:8088/api/customers')
    .then(response => response.json())
    .then(data => {
      document.getElementById('total-customers').querySelector('p').textContent = data.length;
    })
    .catch(error => {
      console.error('Error fetching customers count:', error);
    });
}

// Add click event to the Dashboard button (assuming it's the first <a> element in the sidebar)
document.querySelectorAll('.sidebar nav ul li a')[0].addEventListener('click', () => {
  window.location.reload();
});
