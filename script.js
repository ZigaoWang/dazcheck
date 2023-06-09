// Cache the task list element
const taskList = document.getElementById('taskList');

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  taskList.innerHTML = '';

  for (const task of tasks) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', toggleTask);
    checkbox.checked = task.completed;

    const span = document.createElement('span');
    span.textContent = task.text;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editTask(li, span));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(li));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    taskList.appendChild(li);

    if (task.completed) {
      li.classList.add('done');
      span.style.textDecoration = 'line-through';
    }
  }
}

// Save tasks to local storage
function saveTasks() {
  const tasks = [];

  for (const li of taskList.children) {
    const checkbox = li.querySelector('input[type="checkbox"]');
    const span = li.querySelector('span');

    const task = {
      text: span.textContent.trim(),
      completed: checkbox.checked
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
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', toggleTask);

    const span = document.createElement('span');
    span.textContent = taskText;

    li.appendChild(checkbox);
    li.appendChild(span);
    taskList.insertBefore(li, taskList.firstChild); // Add new task to the top of the list
    taskInput.value = '';

    saveTasks(); // Save tasks to local storage
  }
}

// Toggle the task completion
function toggleTask(event) {
  const checkbox = event.target;
  const li = checkbox.parentNode;

  li.classList.toggle('done');
  saveTasks(); // Save tasks to local storage

  if (checkbox.checked) {
    // Play sound effect only when the task is checked (finished)
    const audio = new Audio('task-done.mp3');
    audio.play();
  }
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

// Edit the task
function editTask(li, span) {
  const newText = prompt('Edit the task:', span.textContent.trim());

  if (newText !== null && newText.trim() !== '') {
    span.textContent = newText.trim();
    saveTasks();
  }
}

// Delete the task
function deleteTask(li) {
  const confirmation = confirm('Are you sure you want to delete this task?');

  if (confirmation) {
    li.remove();
    saveTasks();
  }
}
