// Event listener for "Manage Cars" button
document.getElementById('manage-cars').addEventListener('click', () => {
  // Display car list and car actions, hide other lists (booking & customer)
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

let selectedCarId = null;
const carList = [];

// Fetch car data from the API and update the car list
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

// Update the car table UI with the latest data
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

// Set the selected car index and enable the update and delete buttons
function selectCar(index) {
  selectedCarId = index;
  document.getElementById('update-car').disabled = false;
  document.getElementById('delete-car').disabled = false;
}

// Event listener for "Add Car" button
document.getElementById('add-car').addEventListener('click', () => {
  // Display the add/update form and overlay
  document.getElementById('car-form').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';

  // Reset the form fields and any error messages
  resetCarForm();

  // Hide the ID field and its label (for new car entry)
  document.getElementById('car-id').style.display = 'none';
  document.querySelector('label[for="car-id"]').style.display = 'none';
});

// Event listener for "Cancel" button in car actions
document.getElementById('cancel-car').addEventListener('click', () => {
  // Hide the car list, actions, form, and overlay
  document.getElementById('car-list').style.display = 'none';
  document.getElementById('car-actions').style.display = 'none';
  document.getElementById('car-form').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';

  resetCarForm();      // Reset form fields
  clearErrorMessages(); // Clear any displayed error messages
});

// Remove all error messages from the form
function clearErrorMessages() {
  document.querySelectorAll('.error-message').forEach(el => el.remove());
}

// Reset all fields in the car form to their default state
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

// Event listener for "Update Car" button
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

// Event listener for "Delete Car" button
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

// Event listener for submitting the car form (for both add and update)
document.getElementById('submit-car').addEventListener('click', (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  // Retrieve and trim input values from the form
  const make = document.getElementById('car-make').value.trim();
  const model = document.getElementById('car-model').value.trim();
  const year = document.getElementById('car-year').value.trim();
  const price = document.getElementById('car-price').value.trim();
  const type = document.getElementById('car-type').value.trim();
  const status = document.getElementById('car-status').value;

  // Get the current year for validation
  const currentYear = new Date().getFullYear();

  // Remove any previous error messages
  document.querySelectorAll('.error-message').forEach(el => el.remove());

  let isValid = true;

  // Validate "Make" input
  if (!make) {
    showError('car-make', 'Make is required.');
    isValid = false;
  } else if (!/^[A-Za-z0-9\s\-]+$/.test(make)) {
    showError('car-make', 'Make must be a valid string containing letters, numbers, or dashes.');
    isValid = false;
  }

  // Validate "Model" input
  if (!model) {
    showError('car-model', 'Model is required.');
    isValid = false;
  } else if (!/^[A-Za-z0-9\s\-]+$/.test(model)) {
    showError('car-model', 'Model must be a valid string containing letters, numbers, or dashes.');
    isValid = false;
  }

  // Validate "Year" input
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

  // Validate "Price Per Day" input
  if (!price) {
    showError('car-price', 'Price per day is required.');
    isValid = false;
  } else if (isNaN(price) || price <= 0) {
    showError('car-price', 'Price per day must be a positive number.');
    isValid = false;
  }

  // Validate "Type" input
  if (!type) {
    showError('car-type', 'Type is required.');
    isValid = false;
  } else if (!/^[A-Za-z0-9\s\-]+$/.test(type)) {
    showError('car-type', 'Type must be a valid string containing letters, numbers, or dashes.');
    isValid = false;
  }

  // If any validation fails, do not proceed with form submission
  if (!isValid) return;

  // Construct the data object to be submitted
  const carData = {
    make,
    model,
    year,
    price_per_day: price,
    status,
    type
  };

  if (selectedCarId === null) {
    // Add a new car (POST request)
    fetch('http://localhost:8088/api/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(carData)
    })
      .then(response => response.json())
      .then(newCar => {
        carList.push(newCar); // Add the new car to the car array
        alert('Car added successfully');
        updateCarList(); // Refresh the car list in the UI
        resetCarForm();  // Clear the form fields
      })
      .catch(error => {
        console.error('Error adding car:', error);
      });
  } else {
    // Update an existing car (PUT request)
    fetch(`http://localhost:8088/api/cars/${carList[selectedCarId].id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(carData)
    })
      .then(response => response.json())
      .then(updatedCar => {
        carList[selectedCarId] = updatedCar; // Update the selected car in the array
        alert('Car updated successfully');
        updateCarList(); // Refresh the car list in the UI
        resetCarForm();  // Clear the form fields
      })
      .catch(error => {
        console.error('Error updating car:', error);
      });
  }

  // Close the form and overlay after submission
  document.getElementById('car-form').style.display = 'none';
  document.getElementById('car-actions').style.display = 'block';
  document.getElementById('overlay').style.display = 'none';
});

// Function to display error messages next to form inputs
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
