document.addEventListener("DOMContentLoaded", () => {
  // Remove inline onclick from the search button in index.html
  const searchButton = document.querySelector(".search-btn");
  
  searchButton.addEventListener("click", () => {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    // Validate that the end date is after the start date
    if (new Date(startDate) >= new Date(endDate)) {
      alert("End date must be after start date.");
      return;
    }

    // Redirect to search_results.html with query parameters
    window.location.href = `/pages/search_results.html?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
  });
});
