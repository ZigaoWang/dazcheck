// Cache the task list element
const taskList = document.getElementById('taskList');

// Load tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  for (const task of tasks) {
    const li = document.createElement('li');
    li.innerHTML = `<span onclick="toggleTask(this)">☐</span>${task.text}`;

    if (task.completed) {
      li.classList.add('done');
      li.firstChild.innerHTML = '✔';
    }

    taskList.insertBefore(li, taskList.firstChild);
  }
}

// Save tasks to local storage
function saveTasks() {
  const tasks = [];

  for (const li of taskList.children) {
    const task = {
      text: li.textContent.trim(),
      completed: li.classList.contains('done')
    };
    tasks.push(task);
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a task to the list
function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();

  if (taskText !== '') {
    const li = document.createElement('li');
    li.innerHTML = `<span onclick="toggleTask(this)">☐</span>${taskText}`;
    taskList.insertBefore(li, taskList.firstChild); // Add new task to the top of the list
    taskInput.value = '';

    saveTasks(); // Save tasks to local storage
  }
}

// Toggle the task completion
function toggleTask(span) {
  const li = span.parentNode;
  li.classList.toggle('done');

  if (li.classList.contains('done')) {
    span.innerHTML = '✔';
  } else {
    span.innerHTML = '☐';
  }

  saveTasks(); // Save tasks to local storage

  // Play sound effect
  const audio = new Audio('task-done.mp3');
  audio.play();
}

// Clear all tasks
function clearTasks() {
  const confirmation = confirm('Are you sure you want to clear all tasks?');

  if (confirmation) {
    taskList.innerHTML = ''; // Clear all tasks from the list
    localStorage.removeItem('tasks'); // Remove tasks from local storage
  }
}

// Load tasks on page load
window.addEventListener('load', loadTasks);

// Add task button click event
const addTaskButton = document.getElementById('addTaskButton');
addTaskButton.addEventListener('click', addTask);

// Handle enter key press on task input
const taskInput = document.getElementById('taskInput');
taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

// Clear tasks button click event
const clearTasksButton = document.getElementById('clearTasksButton');
clearTasksButton.addEventListener('click', clearTasks);
