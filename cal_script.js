document.addEventListener("DOMContentLoaded", function() {
  const calendar = document.getElementById('calendar-body');
  const eventForm = document.getElementById("eventForm");
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const detailsModal = document.getElementById('detailsModal');
  const eventList = document.getElementById('eventList');
  const closeDetailsBtn = document.getElementById('closeDetails');

  let events = {};
  let selectedDate = null;
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Initialize Calendar Header
  let dataHead = "<tr>";
  days.forEach(day => {
    dataHead += `<th>${day}</th>`;
  });
  dataHead += "</tr>";
  document.getElementById("thead-month").innerHTML = dataHead;

  const monthYearDisplay = document.getElementById('monthYearDisplay');

  // Function to Create Calendar
  function createCalendar(month, year) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayIndex = new Date(year, month, 1).getDay();
      const emptyDays = Array(firstDayIndex).fill('');

      calendar.innerHTML = '';
      monthYearDisplay.textContent = `${getMonthName(month)} ${year}`;

      let row = document.createElement("tr");

      // Add empty cells for days before the first day of the month
      emptyDays.forEach(() => {
          const emptyCell = document.createElement("td");
          row.appendChild(emptyCell);
      });

      // Get today's date for comparison
      const today = new Date();
      const todayDateKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

      for (let day = 1; day <= daysInMonth; day++) {
          const dayCell = document.createElement("td");
          dayCell.classList.add("day-picker");

          // Create a container for date number and button
          const cellContent = document.createElement("div");
          cellContent.classList.add("calendar-cell-content");

          // Date Number
          const dateNumber = document.createElement("div");
          dateNumber.classList.add("date-number");
          dateNumber.textContent = day;
          cellContent.appendChild(dateNumber);

          const dateKey = `${year}-${pad(month + 1)}-${pad(day)}`;

          // Highlight the current date
          if (dateKey === todayDateKey) {
              dayCell.classList.add("selected");
          }

          // Highlight dates with events
          if (events[dateKey]) {
              dayCell.classList.add("highlighted");
              const seeDetailsBtn = document.createElement("button");
              seeDetailsBtn.textContent = "See Details";
              seeDetailsBtn.classList.add("see-details");
              seeDetailsBtn.addEventListener("click", (e) => {
                  e.stopPropagation(); // Prevent triggering the cell's click event
                  showEventDetails(dateKey);
              });
              cellContent.appendChild(seeDetailsBtn);
          }

          dayCell.appendChild(cellContent);

          // Add click event to open event form
          dayCell.addEventListener("click", () => openEventForm(day, month, year));

          row.appendChild(dayCell);

          // When the row is complete, append it to the calendar
          if (row.children.length === 7) {
              calendar.appendChild(row);
              row = document.createElement("tr");
          }
      }

      // Append the last row if it has any cells
      if (row.children.length > 0) {
          // Fill the remaining cells of the last row with empty cells
          while (row.children.length < 7) {
              const emptyCell = document.createElement("td");
              row.appendChild(emptyCell);
          }
          calendar.appendChild(row);
      }
  }

  // Utility function to pad single-digit numbers with a leading zero
  function pad(number) {
      return number < 10 ? '0' + number : number;
  }


  // Helper function to pad month and day with leading zeros
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  // Function to get month name from index
  function getMonthName(monthIndex) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    return monthNames[monthIndex];
  }

  // Function to open the Add Event form
  function openEventForm(day, month, year) {
    selectedDate = `${year}-${pad(month + 1)}-${pad(day)}`;
    document.getElementById("eventDate").value = selectedDate;
    document.getElementById("eventModal").style.display = "block";
  }

  // Handle Event Form Submission
  eventForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const eventTitle = document.getElementById("eventTitle").value.trim();
    const eventDescription = document.getElementById("eventDescription").value.trim();

    if (!eventTitle || !eventDescription) {
      alert("Please provide both title and description for the event.");
      return;
    }

    if (!events[selectedDate]) {
      events[selectedDate] = [];
    }

    events[selectedDate].push({ title: eventTitle, description: eventDescription });
    document.getElementById("eventModal").style.display = "none";
    eventForm.reset();
    createCalendar(currentMonth, currentYear);
  });

  // Function to Show Event Details in Modal
  function showEventDetails(dateKey) {
    const eventListHtml = events[dateKey].map(event => `
      <li>
        <strong>${escapeHTML(event.title)}</strong><br>
        ${escapeHTML(event.description)}
      </li>
    `).join('');
    eventList.innerHTML = eventListHtml || "<li>No events for this day.</li>";
    detailsModal.style.display = 'block';
  }

  // Function to Escape HTML to Prevent XSS
  function escapeHTML(str) {
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
  }

  // Close Details Modal
  closeDetailsBtn.addEventListener("click", () => {
    detailsModal.style.display = 'none';
  });

  // Navigate to Previous Month
  prevMonthBtn.addEventListener("click", () => {
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    currentYear = (currentMonth === 11) ? currentYear - 1 : currentYear;
    createCalendar(currentMonth, currentYear);
  });

  // Navigate to Next Month
  nextMonthBtn.addEventListener("click", () => {
    currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
    currentYear = (currentMonth === 0) ? currentYear + 1 : currentYear;
    createCalendar(currentMonth, currentYear);
  });

  // Close Modals When Clicking Outside
  window.addEventListener("click", (e) => {
    if (e.target === document.getElementById("eventModal")) {
      document.getElementById("eventModal").style.display = "none";
    }
    if (e.target === detailsModal) {
      detailsModal.style.display = "none";
    }
  });


  function exportEventsToExcel(){
    const workBook = XLSX.utils.book_new();
    const sheetData = [];

    // create header row
    sheetData.push(["Date", "Event Title", "Event Description"]);

    // process each event
    for(const [date, eventList] of Object.entries(events)){
      eventList.forEach(event => {
        sheetData.push([date, event.title, event.description]);
      });
    }
    const workSheet  = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "Event Details")

    // create and download 
    XLSX.writeFile(workBook, "Event_details.xlsx");
  }

  document.getElementById("exportEventBtn").addEventListener("click",  exportEventsToExcel)
  
  // Initialize Calendar on Page Load
  createCalendar(currentMonth, currentYear);
  console.log(events)
});
