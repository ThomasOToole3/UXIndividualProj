
function showTaskInput() {
    document.getElementById("taskInputSection").style.display = "block";
}


function insertData(inputId, tableBodyId) {
    const input = document.getElementById(inputId);
    const task = input.value.trim();
    if (task === "") return;

    addTaskToTable(tableBodyId, task);
    saveTask(tableBodyId, task);
    input.value = "";
}


function addTaskToTable(tableBodyId, task) {
    const tableBody = document.getElementById(tableBodyId);
    const row = tableBody.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);

    cell1.textContent = task;
    cell2.innerHTML = `<button onclick="deleteRow(this, '${tableBodyId}', '${task}')">Delete</button>`;

    
    cell1.addEventListener("click", function () {
        populateEventDetails(task);  
    });
}


function saveTask(tableBodyId, task) {
    const stored = JSON.parse(localStorage.getItem(tableBodyId)) || [];
    stored.push(task);
    localStorage.setItem(tableBodyId, JSON.stringify(stored));

    
    const today = new Date();
    const key = `tasks-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const dailyTasks = JSON.parse(localStorage.getItem(key)) || [];
    dailyTasks.push(task);
    localStorage.setItem(key, JSON.stringify(dailyTasks));

    generateCalendar(); 
}


function deleteRow(button, tableBodyId, task) {
   
    button.closest('tr').remove();

   
    let tasks = JSON.parse(localStorage.getItem(tableBodyId)) || [];
    tasks = tasks.filter(t => t !== task);
    localStorage.setItem(tableBodyId, JSON.stringify(tasks));

    
    const today = new Date();
    const key = `tasks-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    let dailyTasks = JSON.parse(localStorage.getItem(key)) || [];
    dailyTasks = dailyTasks.filter(t => t !== task);
    localStorage.setItem(key, JSON.stringify(dailyTasks));

    generateCalendar(); 
}


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


function generateCalendar() {
    const calendar = document.getElementById("calendar");
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = date.getDate();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendar.innerHTML = ''; 

    
    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement("div");
        calendar.appendChild(blank);
    }

    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "calendar-day";
        dayDiv.textContent = day;

        const taskKey = `tasks-${year}-${month + 1}-${day}`;
        if (localStorage.getItem(taskKey)) {
            dayDiv.classList.add("task-day"); 
        }

        calendar.appendChild(dayDiv);
    }
}

function populateEventDetails(task) {
    const eventDetailsDiv = document.querySelector(".event-description");

    
    eventDetailsDiv.innerHTML = `
        <h3>Event Details</h3>
        <p><strong>Task:</strong> ${task}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    `;
}


window.onload = function () {
    generateCalendar();
    loadTasks();
};

function updateDateTime() {
    const now = new Date();
    const formatted = now.toLocaleString(); 
    document.getElementById("currentDateTime").textContent = `Current Date & Time: ${formatted}`;
}


updateDateTime();
setInterval(updateDateTime, 1000);


window.onload = function () {
    generateCalendar();
    loadTasks(); 
    updateDateTime();
    setInterval(updateDateTime, 1000);
};
