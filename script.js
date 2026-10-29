
let tasks = [];
let currentView = "pending";
let lastNotificationCheck = "";
let editingTaskId = null;

document.addEventListener("DOMContentLoaded", function () {
  loadTasks();
  setMinimumDate();
  renderTasks();
  updateDashboard();
  updateReminders();

  document.getElementById("task-form").addEventListener("submit", function (e) {
    e.preventDefault();
    addTask();
  });

  document.getElementById("show-pending").addEventListener("click", function () {
    currentView = "pending";
    renderTasks();
  });

  document.getElementById("show-completed").addEventListener("click", function () {
    currentView = "completed";
    renderTasks();
  });

  document.getElementById("notification-btn").addEventListener("click", function () {
    const panel = document.getElementById("notification-panel");
    panel.hidden = !panel.hidden;
    updateReminders();
  });

  document.getElementById("enable-notifications").addEventListener("click", function () {
    enableNotifications();
  });

  document.addEventListener("click", function (e) {
    const area = document.querySelector(".notification-area");
    const panel = document.getElementById("notification-panel");

    if (!area.contains(e.target)) {
      panel.hidden = true;
    }
  });

  setInterval(function () {
    setMinimumDate();
    updateDashboard();
    updateReminders();
    checkDesktopNotifications();
  }, 60000);

  checkDesktopNotifications();
});

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

function setMinimumDate() {
  document.getElementById("task-date").min = getToday();
}

function getDaysUntil(dateString) {
  if (!dateString) return null;

  const parts = dateString.split("-").map(Number);

  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return null;
  }

  const due = Date.UTC(parts[0], parts[1] - 1, parts[2]);

  const today = new Date();

  const current = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return Math.round((due - current) / 86400000);
}

function addTask() {
  const descInput = document.getElementById("task-desc");
  const dateInput = document.getElementById("task-date");
  const priorityInput = document.getElementById("task-priority");

  const desc = descInput.value.trim();
  const dueDate = dateInput.value;
  const priority = priorityInput.value;

  if (!desc) {
    alert("Please enter a task description.");
    return;
  }

  if (!dueDate) {
    alert("Please select a due date.");
    return;
  }

  if (dueDate < getToday()) {
    alert("Due date cannot be before today.");
    return;
  }

  if (!["Low", "Medium", "High"].includes(priority)) {
    alert("Please select a valid priority.");
    return;
  }

  const task = {
    id: Date.now() + Math.random(),
    desc: desc,
    dueDate: dueDate,
    priority: priority,
    completed: false
  };

  tasks.push(task);

  saveTasks();
  resetForm();
  currentView = "pending";
  refreshUI();
}

function refreshUI() {
  renderTasks();
  updateDashboard();
  updateReminders();
  checkDesktopNotifications();
}

function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  document.getElementById("show-pending").classList.toggle(
    "active", currentView === "pending"
  );

  document.getElementById("show-completed").classList.toggle(
    "active", currentView === "completed"
  );

  const filteredTasks = tasks
    .filter(function (task) {
      return currentView === "completed"
        ? task.completed
        : !task.completed;
    })
    .sort(function (a, b) {
      return (a.dueDate || "9999-12-31").localeCompare(
        b.dueDate || "9999-12-31"
      );
    });

  if (filteredTasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.innerHTML = "<span>📭</span>No tasks found here.";
    taskList.appendChild(empty);
    return;
  }

  filteredTasks.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "task";

    const title = document.createElement("div");
    title.className = "task-title";
    title.textContent = task.desc;

    const details = document.createElement("div");
    details.className = "details";

    const days = getDaysUntil(task.dueDate);

    let dateLabel = task.dueDate || "No due date";

    if (days === 0) {
      dateLabel += " · Due Today";
    } else if (days === 1) {
      dateLabel += " · Due Tomorrow";
    } else if (days !== null && days < 0) {
      dateLabel += " · Overdue";
      if (!task.completed) {
        details.classList.add("overdue-text");
      }
    }

    details.textContent = "📅 Due: " + dateLabel;

    const priority = document.createElement("span");
    priority.className = "priority " + task.priority;
    priority.textContent = task.priority;

    const actions = document.createElement("div");
    actions.className = "actions";

    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.textContent = task.completed ? "↩ Undo" : "✓ Complete";
    completeBtn.addEventListener("click", function () {
      toggleComplete(task.id);
    });

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "✎ Edit";
    editBtn.addEventListener("click", function () {
      editTask(task.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕ Delete";
    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    actions.appendChild(completeBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(title);
    li.appendChild(details);
    li.appendChild(priority);
    li.appendChild(actions);

    taskList.appendChild(li);
  });
}

function toggleComplete(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasks();
  refreshUI();
}

function editTask(id) {
  const task = tasks.find(function (t) {
    return t.id === id;
  });

  if (!task) return;

  const newDesc = prompt("Edit task description:", task.desc);

  if (newDesc === null) return;

  if (!newDesc.trim()) {
    alert("Task description cannot be empty.");
    return;
  }

  const newDate = prompt(
    "Edit due date (YYYY-MM-DD):",
    task.dueDate || getToday()
  );

  if (newDate === null) return;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate) ||
      !Number.isFinite(Date.parse(newDate))) {
    alert("Please enter a valid date in YYYY-MM-DD format.");
    return;
  }

  if (newDate < getToday()) {
    alert("Due date cannot be before today.");
    return;
  }

  const newPriority = prompt(
    "Edit priority (Low, Medium, High):",
    task.priority
  );

  if (newPriority === null) return;

  const validPriority = ["Low", "Medium", "High"].find(function (p) {
    return p.toLowerCase() === newPriority.trim().toLowerCase();
  });

  if (!validPriority) {
    alert("Priority must be Low, Medium, or High.");
    return;
  }

  task.desc = newDesc.trim();
  task.dueDate = newDate;
  task.priority = validPriority;

  saveTasks();
  refreshUI();
}

function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) {
    return;
  }

  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });

  saveTasks();
  refreshUI();
}

function updateDashboard() {
  const total = tasks.length;

  const pending = tasks.filter(function (t) {
    return !t.completed;
  }).length;

  const completed = tasks.filter(function (t) {
    return t.completed;
  }).length;

  const dueToday = tasks.filter(function (t) {
    return !t.completed && getDaysUntil(t.dueDate) === 0;
  }).length;

  document.getElementById("total-tasks").textContent = total;
  document.getElementById("pending-tasks").textContent = pending;
  document.getElementById("completed-tasks").textContent = completed;
  document.getElementById("due-today").textContent = dueToday;
}

function getReminders() {
  return tasks
    .filter(function (task) {
      if (task.completed || !task.dueDate) {
        return false;
      }

      const days = getDaysUntil(task.dueDate);
      return days !== null && days <= 1;
    })
    .sort(function (a, b) {
      return a.dueDate.localeCompare(b.dueDate);
    });
}

function getReminderMessage(task) {
  const days = getDaysUntil(task.dueDate);

  if (days < 0) {
    return "Overdue by " + Math.abs(days) + " day(s)";
  }

  if (days === 0) {
    return "Due today!";
  }

  return "Due tomorrow!";
}

function updateReminders() {
  const reminders = getReminders();

  const count = document.getElementById("notification-count");
  const list = document.getElementById("notification-list");

  count.textContent = reminders.length;
  list.innerHTML = "";

  if (reminders.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "🎉 You're all caught up!";
    list.appendChild(empty);
    return;
  }

  reminders.forEach(function (task) {
    const item = document.createElement("div");
    item.className = "reminder-item";

    const name = document.createElement("strong");
    name.textContent = task.desc;

    const message = document.createElement("div");
    message.textContent = "🔔 " + getReminderMessage(task);

    item.appendChild(name);
    item.appendChild(message);
    list.appendChild(item);
  });
}

async function enableNotifications() {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications.");
    return;
  }

  if (!window.isSecureContext) {
    alert("Desktop notifications require localhost or HTTPS.");
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    alert("Desktop notifications enabled!");
    checkDesktopNotifications();
  } else {
    alert("Notification permission was not granted.");
  }
}

function checkDesktopNotifications() {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const today = getToday();

  getReminders().forEach(function (task) {
    const key = "taskflow-reminder-" + task.id + "-" + today;

    if (localStorage.getItem(key)) return;

    try {
      new Notification("TaskFlow Reminder 🔔", {
        body: task.desc + " — " + getReminderMessage(task),
        icon: "https://cdn-icons-png.flaticon.com/512/906/906334.png"
      });

      localStorage.setItem(key, "sent");
    } catch (error) {
      console.log("Desktop notification unavailable:", error);
    }
  });
}

function resetForm() {
  document.getElementById("task-form").reset();
  setMinimumDate();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem("tasks"));

    tasks = Array.isArray(saved) ? saved : [];

    tasks = tasks.filter(function (task) {
      return task && typeof task === "object";
    });
  } catch (error) {
    tasks = [];
  }
}
