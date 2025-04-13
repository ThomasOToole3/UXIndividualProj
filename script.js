// Show the hidden task input section
function showTaskInput() {
    document.getElementById("taskInputSection").style.display = "block";
}

// Insert a task into the table and save to localStorage
function insertData(inputId, tableBodyId) {
    const input = document.getElementById(inputId);
    const task = input.value.trim();
    if (task === "") return;

    addTaskToTable(tableBodyId, task);
    saveTask(tableBodyId, task);
    input.value = "";
}

// Add a row to the specified table with a delete button
function addTaskToTable(tableBodyId, task) {
    const tableBody = document.getElementById(tableBodyId);
    const row = tableBody.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);

    cell1.textContent = task;
    cell2.innerHTML = `<button onclick="deleteRow(this, '${tableBodyId}', '${task}')">Delete</button>`;

    // Add a click event to the task cell (to show task details)
    cell1.addEventListener("click", function () {
        populateEventDetails(task);  // Populate the event details div with the task information
    });
}

// Save a task to localStorage
function saveTask(tableBodyId, task) {
    const stored = JSON.parse(localStorage.getItem(tableBodyId)) || [];
    stored.push(task);
    localStorage.setItem(tableBodyId, JSON.stringify(stored));

    // Save for today's date
    const today = new Date();
    const key = `tasks-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const dailyTasks = JSON.parse(localStorage.getItem(key)) || [];
    dailyTasks.push(task);
    localStorage.setItem(key, JSON.stringify(dailyTasks));

    generateCalendar(); // update calendar after saving
}

// Delete a row from the table and remove from localStorage
function deleteRow(button, tableBodyId, task) {
    // Remove row from the table
    button.closest('tr').remove();

    // Remove task from localStorage
    let tasks = JSON.parse(localStorage.getItem(tableBodyId)) || [];
    tasks = tasks.filter(t => t !== task);
    localStorage.setItem(tableBodyId, JSON.stringify(tasks));

    // Remove from today's tasks as well
    const today = new Date();
    const key = `tasks-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    let dailyTasks = JSON.parse(localStorage.getItem(key)) || [];
    dailyTasks = dailyTasks.filter(t => t !== task);
    localStorage.setItem(key, JSON.stringify(dailyTasks));

    generateCalendar(); // update calendar after deleting
}

// Load saved tasks from localStorage on page load
function loadTasks() {
    const allTableIds = [
        "TableBody9", "TableBody10", "TableBody11", "TableBody12",
        "TableBody1", "TableBody2", "TableBody3", "TableBody4", "TableBody5"
    ];

    allTableIds.forEach(id => {
        const stored = JSON.parse(localStorage.getItem(id)) || [];
        stored.forEach(task => {
            addTaskToTable(id, task);
        });
    });
}

// Generate the calendar
function generateCalendar() {
    const calendar = document.getElementById("calendar");
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = date.getDate();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendar.innerHTML = ''; // Clear previous content

    // Fill in blanks before first day
    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement("div");
        calendar.appendChild(blank);
    }

    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "calendar-day";
        dayDiv.textContent = day;

        const taskKey = `tasks-${year}-${month + 1}-${day}`;
        if (localStorage.getItem(taskKey)) {
            dayDiv.classList.add("task-day"); // Highlight day if it has tasks
        }

        calendar.appendChild(dayDiv);
    }
}

// Populate event details when a task is clicked
function populateEventDetails(task) {
    const eventDetailsDiv = document.querySelector(".event-description");

    // Add task details to the event description div (you can expand this for more info)
    eventDetailsDiv.innerHTML = `
        <h3>Event Details</h3>
        <p><strong>Task:</strong> ${task}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    `;
}

// Update calendar on load
window.onload = function () {
    generateCalendar();
    loadTasks(); // Load existing tasks from localStorage
};

function updateDateTime() {
    const now = new Date();
    const formatted = now.toLocaleString(); // includes date and time
    document.getElementById("currentDateTime").textContent = `Current Date & Time: ${formatted}`;
}

// Call it immediately and then update every second
updateDateTime();
setInterval(updateDateTime, 1000);


window.onload = function () {
    generateCalendar();
    loadTasks(); 
    updateDateTime();
    setInterval(updateDateTime, 1000);
};
