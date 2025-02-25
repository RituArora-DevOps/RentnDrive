document.addEventListener("DOMContentLoaded", () => {
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
