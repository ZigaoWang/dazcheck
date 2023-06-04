// Task Manager
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const finishedList = document.getElementById("finished-list");
const settingsBtn = document.getElementById("settings-btn");
const settingsPopup = document.getElementById("settings-popup");
const closeSettingsBtn = document.getElementById("close-settings-btn");
const soundToggle = document.getElementById("sound-toggle");

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const key = "__storage_test__";
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
};

// Retrieve tasks from localStorage
const getTasksFromStorage = () => {
  if (isLocalStorageAvailable()) {
    const tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
  }
  return [];
};

// Save tasks to localStorage
const saveTasksToStorage = (tasks) => {
  if (isLocalStorageAvailable()) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
};

// Retrieve task status from localStorage
const getTaskStatusFromStorage = () => {
  if (isLocalStorageAvailable()) {
    const taskStatus = localStorage.getItem("taskStatus");
    return taskStatus ? JSON.parse(taskStatus) : [];
  }
  return [];
};

// Save task status to localStorage
const saveTaskStatusToStorage = (taskStatus) => {
  if (isLocalStorageAvailable()) {
    localStorage.setItem("taskStatus", JSON.stringify(taskStatus));
  }
};

// Retrieve settings from localStorage
const getSettingsFromStorage = () => {
  if (isLocalStorageAvailable()) {
    const settings = localStorage.getItem("settings");
    return settings ? JSON.parse(settings) : { sound: false };
  }
  return { sound: false };
};

// Save settings to localStorage
const saveSettingsToStorage = (settings) => {
  if (isLocalStorageAvailable()) {
    localStorage.setItem("settings", JSON.stringify(settings));
  }
};

// Initialize tasks array, task status, and settings
let tasks = getTasksFromStorage();
let taskStatus = getTaskStatusFromStorage();
let settings = getSettingsFromStorage();

// Function to create a new task item
const createTaskItem = (task) => {
  const taskItem = document.createElement("li");
  taskItem.className = "task-item";
  taskItem.innerHTML = `
    <input type="checkbox" class="task-checkbox">
    <span class="task-text">${task}</span>
    <div class="task-actions">
      <button class="edit-button">Edit</button>
      <button class="delete-button">Delete</button>
    </div>
  `;
  return taskItem;
};

// Function to add a new task
const addTask = () => {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    const taskItem = createTaskItem(taskText);
    taskList.appendChild(taskItem);
    tasks.push(taskText);
    taskStatus.push(false); // Add task status as false (not finished)
    saveTasksToStorage(tasks);
    saveTaskStatusToStorage(taskStatus);
    taskInput.value = "";
  }
};

// Event listener for adding a task
addTaskBtn.addEventListener("click", addTask);

// Event listener for Enter key to add a task
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

// Function to handle task completion
// Function to handle task completion
const completeTask = (taskItem, index) => {
  taskList.removeChild(taskItem);
  finishedList.appendChild(taskItem);
  taskStatus[index] = true; // Set task status as true (finished)
  saveTaskStatusToStorage(taskStatus);

  if (settings.sound) {
    const audio = new Audio("check.mp3"); // Replace "check.mp3" with the path to your sound file
    audio.play();
  }
};

// Event listener for task completion
taskList.addEventListener("change", (event) => {
  if (event.target.matches(".task-checkbox")) {
    const taskItem = event.target.closest(".task-item");
    const index = Array.from(taskList.children).indexOf(taskItem);
    completeTask(taskItem, index);
  }
});

// Function to delete a task
const deleteTask = (taskItem, index) => {
  tasks.splice(index, 1);
  taskStatus.splice(index, 1);
  saveTasksToStorage(tasks);
  saveTaskStatusToStorage(taskStatus);
  taskItem.remove();
};

// Event listener for deleting a task
taskList.addEventListener("click", (event) => {
  if (event.target.matches(".delete-button")) {
    const taskItem = event.target.closest(".task-item");
    const index = Array.from(taskList.children).indexOf(taskItem);
    deleteTask(taskItem, index);
  }
});

// Function to open settings popup
const openSettingsPopup = () => {
  settingsPopup.style.display = "flex";
};

// Event listener for opening settings popup
settingsBtn.addEventListener("click", openSettingsPopup);

// Function to close settings popup
const closeSettingsPopup = () => {
  settingsPopup.style.display = "none";
};

// Event listener for closing settings popup
closeSettingsBtn.addEventListener("click", closeSettingsPopup);

// Function to handle sound toggle
const toggleSound = () => {
  settings.sound = soundToggle.checked;
  saveSettingsToStorage(settings);
};

// Event listener for sound toggle
soundToggle.addEventListener("change", toggleSound);

// Initialize sound toggle state from settings
soundToggle.checked = settings.sound;

// Initialize tasks and task status from storage
tasks.forEach((task, index) => {
  const taskItem = createTaskItem(task);
  taskList.appendChild(taskItem);
  if (taskStatus[index]) {
    completeTask(taskItem, index);
  }
});
