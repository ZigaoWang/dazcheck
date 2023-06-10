// Function to generate a unique ID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Function to get the cached task list from local storage
function getCachedTaskList() {
  const cachedTaskList = localStorage.getItem('taskList');
  return cachedTaskList ? JSON.parse(cachedTaskList) : [];
}

// Function to save the task list to local storage
function saveTaskListToCache(taskList) {
  localStorage.setItem('taskList', JSON.stringify(taskList));
}

// Function to render the task list from the cached data
function renderTaskListFromCache() {
  const taskList = getCachedTaskList();
  const taskListContainer = document.getElementById('taskList');

  taskListContainer.innerHTML = ''; // Clear existing task list

  taskList.forEach(function (task) {
    const li = createTaskElement(task.id, task.text, task.completed);
    taskListContainer.appendChild(li);
  });
}

// Function to create a task element
function createTaskElement(id, taskText, completed = false) {
  const li = document.createElement('li');
  li.dataset.id = id;
  li.classList.add('task-item');
  if (completed) {
    li.classList.add('done');
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;
  checkbox.addEventListener('change', function () {
    li.classList.toggle('done');
    updateTaskListCache();

    if (checkbox.checked) {
      playTaskDoneSound();
    }
  });

  const span = document.createElement('span');
  span.textContent = taskText;
  span.addEventListener('dblclick', function () {
    toggleEditMode(li);
  });

  li.appendChild(checkbox);
  li.appendChild(span);

  return li;
}

// Function to toggle between view mode and edit mode
function toggleEditMode(li) {
  li.classList.toggle('edit-mode');
  const span = li.querySelector('span');
  const input = li.querySelector('input[type="text"]');
  if (li.classList.contains('edit-mode')) {
    span.style.display = 'none';
    input.style.display = 'block';
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  } else {
    span.style.display = 'inline';
    input.style.display = 'none';

    const taskList = getCachedTaskList();
    const taskId = li.dataset.id;
    const task = taskList.find((task) => task.id === taskId);
    if (task) {
      task.text = input.value.trim();
      span.textContent = task.text;
      saveTaskListToCache(taskList);
    }
  }
}

// Function to handle task editing
function handleTaskEdit(li) {
  const span = li.querySelector('span');
  const input = li.querySelector('input[type="text"]');
  const taskList = getCachedTaskList();
  const taskId = li.dataset.id;
  const task = taskList.find((task) => task.id === taskId);

  if (task) {
    const taskText = input.value.trim();
    if (taskText === '') {
      li.remove();
      const taskIndex = taskList.indexOf(task);
      taskList.splice(taskIndex, 1);
    } else {
      task.text = taskText;
      span.textContent = taskText;
    }
    saveTaskListToCache(taskList);
  }
}

// Function to update the task list cache
function updateTaskListCache() {
  const taskListContainer = document.getElementById('taskList');
  const taskItems = taskListContainer.getElementsByClassName('task-item');
  const taskList = [];

  for (let i = 0; i < taskItems.length; i++) {
    const taskItem = taskItems[i];
    const taskId = taskItem.dataset.id;
    const taskText = taskItem.querySelector('span').textContent;
    const completed = taskItem.classList.contains('done');

    taskList.push({
      id: taskId,
      text: taskText,
      completed: completed,
    });
  }

  saveTaskListToCache(taskList);
}

// Function to play the task done sound
function playTaskDoneSound() {
  const audio = new Audio('task-done.mp3');
  audio.play();
}

// Function to add a new task
function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();

  if (taskText !== '') {
    const taskId = generateUUID();
    const taskListContainer = document.getElementById('taskList');
    const newTask = createTaskElement(taskId, taskText);
    taskListContainer.appendChild(newTask);
    updateTaskListCache();
    taskInput.value = '';
  }
}

// Function to clear all tasks
function clearTasks() {
  if (confirm('Are you sure you want to clear all tasks?')) {
    const taskListContainer = document.getElementById('taskList');
    taskListContainer.innerHTML = '';
    saveTaskListToCache([]);
  }
}

// Function to handle key press events
function handleKeyPress(event) {
  if (event.keyCode === 13) {
    // Enter key is pressed
    addTask();
  }
}

// Array of quotes
const quotes = [
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
];

// Function to get a random quote
function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

// Print the task list
function printTasks() {
  const printContent = document.getElementById('taskList').innerHTML;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
    <head>
      <title>Print Tasks</title>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        
        .task-list-header {
          text-align: center;
          font-size: 24px;
          margin-bottom: 20px;
          color: #FF6B6B;
        }
        
        .task-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .checkbox {
          width: 30px;
          height: 30px;
          background-color: #FFC0CB;
          margin-right: 10px;
        }
        
        .task-text {
          font-size: 18px;
          color: #FF9F80;
        }
        
        .quote {
          margin-top: 20px;
          font-style: italic;
          text-align: center;
          color: #888;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <h1 class="task-list-header">Task List</h1>
      ${printContent}
      <div class="quote">
        <p>${getRandomQuote()}</p>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// Add event listener to the "Add Task" button
const addTaskButton = document.getElementById('addTaskButton');
addTaskButton.addEventListener('click', addTask);

// Add event listener to the "Print Tasks" button
const printTasksButton = document.getElementById('printTasksButton');
printTasksButton.addEventListener('click', printTasks);

// Add event listener to the "Clear Tasks" button
const clearTasksButton = document.getElementById('clearTasksButton');
clearTasksButton.addEventListener('click', clearTasks);

// Add event listener for key press events on the task input
const taskInput = document.getElementById('taskInput');
taskInput.addEventListener('keypress', handleKeyPress);

// Render the task list from the cached data on page load
renderTaskListFromCache();
