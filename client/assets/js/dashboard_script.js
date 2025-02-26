document.addEventListener("DOMContentLoaded", async () => { // Added async keyword
  // Check if the user is an admin
  if (!await checkAdminRole()) {
      return; // Stop execution if not admin
  }

  const searchButton = document.querySelector(".search-btn");

  searchButton.addEventListener("click", () => {
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;

    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    alert(`Searching for cars from ${startDate} to ${endDate}`);
  });
});