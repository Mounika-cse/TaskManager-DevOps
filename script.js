let tasks = [];

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  renderTasks("pending");

  document.getElementById("task-form").addEventListener("submit", e => {
    e.preventDefault();
    addTask();
  });

  document.getElementById("show-pending").addEventListener("click", () => {
    renderTasks("pending");
  });

  document.getElementById("show-completed").addEventListener("click", () => {
    renderTasks("completed");
  });
});

function addTask() {
  const desc = document.getElementById("task-desc").value.trim();
  const dueDate = document.getElementById("task-date").value;
  const priority = document.getElementById("task-priority").value;

  if (!desc) return;

  const task = {
    id: Date.now(),
    desc,
    dueDate,
    priority,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks("pending");
  document.getElementById("task-form").reset();
}

function renderTasks(type) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  const filteredTasks = tasks
    .filter(t => type === "completed" ? t.completed : !t.completed)
    .sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
      const dateB = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
      return dateA - dateB;
    });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task";

    const details = document.createElement("div");
    details.className = "details";
    if (task.dueDate) {
      details.innerHTML = `<span class="due">Due: </span><span class="${task.completed ? 'red' : ''}">${task.dueDate}</span>`;
    }

    const desc = document.createElement("div");
    desc.textContent = task.desc;

    const actions = document.createElement("div");
    actions.className = "actions";

    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "Undo" : "Complete";
    completeBtn.className = "complete-btn";
    completeBtn.onclick = () => toggleComplete(task.id);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => editTask(task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => deleteTask(task.id);

    actions.appendChild(completeBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    const priority = document.createElement("div");
    priority.className = `priority ${task.priority}`;
    priority.textContent = task.priority;

    li.appendChild(desc);
    li.appendChild(details);
    li.appendChild(actions);
    li.appendChild(priority);

    taskList.appendChild(li);
  });
}

function toggleComplete(id) {
  tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
  saveTasks();
  renderTasks("pending");
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newDesc = prompt("Edit description:", task.desc);
  const newDate = prompt("Edit due date (YYYY-MM-DD):", task.dueDate);
  const newPriority = prompt("Edit priority (High, Medium, Low):", task.priority);

  if (newDesc && newPriority) {
    task.desc = newDesc.trim();
    task.dueDate = newDate;
    task.priority = newPriority;
    saveTasks();
    renderTasks("pending");
  }
}

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks("pending");
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
}
