 
// 1. Task Management Module (Conceptual, could be a class or just functions) 
const taskManager = (function() { 
    let tasks = []; 
    const STORAGE_KEY = 'tasks'; 
 
    // Load tasks from local storage on initialization 
    function loadTasks() { 
        const storedTasks = localStorage.getItem(STORAGE_KEY); 
        if (storedTasks) { 
            tasks = JSON.parse(storedTasks); 
        } 
        renderTasks(); // Render them immediately 
    } 
 
    // Save tasks to local storage 
    function saveTasks() { 
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); 
    } 
 
    // Add a new task 
    function addTask(description, dueDate, priority) { 
        if (!description.trim()) { 
            alert('Task description cannot be empty.'); 
            return false; 
        } 
 
        const newTask = { 
            id: Date.now().toString(), // Simple unique ID 
            description: description.trim(), 
            dueDate: dueDate || '', // Allow empty due date 
            priority: priority || 'Low', 
            isComplete: false 
        }; 
        tasks.push(newTask); 
        saveTasks(); 
        renderTasks(); 
        return true; 
    } 
 
    // Edit an existing task 
    function editTask(id, newDescription, newDueDate, newPriority) { 
        const taskIndex = tasks.findIndex(task => task.id === id); 
        if (taskIndex > -1) { 
            if (!newDescription.trim()) { 
                alert('Task description cannot be empty.'); 
                return false; 
            } 
            tasks[taskIndex].description = newDescription.trim(); 
            tasks[taskIndex].dueDate = newDueDate || ''; 
            tasks[taskIndex].priority = newPriority || 'Low'; 
            saveTasks(); 
            renderTasks(); 
            return true; 
        } 
        return false; 
    } 
 
    // Delete a task 
    function deleteTask(id) { 
        tasks = tasks.filter(task => task.id !== id); 
        saveTasks(); 
        renderTasks(); 
    } 
 
    // Toggle task completion status 
    function toggleTaskComplete(id) { 
        const task = tasks.find(task => task.id === id); 
        if (task) { 
            task.isComplete = !task.isComplete; 
            saveTasks(); 
            renderTasks(); 
        } 
    } 
 
    // Sort tasks by priority (High > Medium > Low) 
    function sortTasksByPriority() { 
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }; 
        tasks.sort((a, b) => { 
            if (a.isComplete && !b.isComplete) return 1; // Completed tasks go to bottom 
            if (!a.isComplete && b.isComplete) return -1; 
            return priorityOrder[b.priority] - priorityOrder[a.priority]; // Sort high to low 
        }); 
        renderTasks(); 
    } 
 
    // Get all tasks (for UI rendering) 
    function getTasks() { 
        return tasks; 
    } 
 
    // Public API 
    return { 
        loadTasks, 
        addTask, 
        editTask, 
        deleteTask, 
        toggleTaskComplete, 
        sortTasksByPriority, 
        getTasks 
    }; 
})(); 
 
// 2. UI Management Module 
const uiManager = (function() { 
    const taskForm = document.getElementById('task-form'); 
    const taskDescriptionInput = document.getElementById('task-description'); 
    const taskDueDateInput = document.getElementById('task-due-date'); 
    const taskPrioritySelect = document.getElementById('task-priority'); 
    const taskList = document.getElementById('task-list'); 
 
    function initializeEventListeners() { 
        taskForm.addEventListener('submit', handleAddTask); 
        taskList.addEventListener('click', handleTaskActions); 
    } 
 
    function handleAddTask(event) { 
        event.preventDefault(); // Prevent page reload 
        const description = taskDescriptionInput.value; 
        const dueDate = taskDueDateInput.value; 
        const priority = taskPrioritySelect.value; 
 
        if (taskManager.addTask(description, dueDate, priority)) { 
            taskDescriptionInput.value = ''; // Clear input 
            taskDueDateInput.value = ''; 
            taskPrioritySelect.value = 'Low'; // Reset priority 
        } 
    } 
 
    function handleTaskActions(event) { 
        const target = event.target; 
        const taskId = target.closest('.task-item')?.dataset.id; // Get ID from closest task-item 
 
        if (!taskId) return; // Not a task action 
 
        if (target.classList.contains('delete-btn')) { 
            if (confirm('Are you sure you want to delete this task?')) { 
                taskManager.deleteTask(taskId); 
            } 
        } else if (target.classList.contains('edit-btn')) { 
            // Implement edit logic: e.g., open a modal or inline edit form 
            const task = taskManager.getTasks().find(t => t.id === taskId); 
            if (task) { 
                // For simplicity, let's prompt. In a real app, use a modal/form. 
                const newDesc = prompt('Edit task description:', task.description); 
                const newDate = prompt('Edit due date (YYYY-MM-DD):', task.dueDate); 
                const newPrio = prompt('Edit priority (High, Medium, Low):', task.priority); 
 
                if (newDesc !== null && newDate !== null && newPrio !== null) { 
                    taskManager.editTask(taskId, newDesc, newDate, newPrio); 
                } 
            } 
        } else if (target.classList.contains('complete-btn')) { 
            taskManager.toggleTaskComplete(taskId); 
        } 
    } 
 
    // Render tasks to the DOM 
    function renderTasks() { 
        taskList.innerHTML = ''; // Clear existing tasks 
        const tasksToRender = taskManager.getTasks(); 
 
        // Sort tasks by priority before rendering 
        taskManager.sortTasksByPriority(); // Call sort before rendering 
 
        tasksToRender.forEach(task => { 
            const li = document.createElement('li'); 
            li.className = `task-item ${task.isComplete ? 'completed' : ''}`; 
            li.dataset.id = task.id; 
 
            li.innerHTML = ` 
                <span class="task-description-text">${task.description}</span> 
                <div class="task-details"> 
                    ${task.dueDate ? `<span>Due: ${task.dueDate}</span>` : ''} 
                </div> 
                <span class="priority-badge ${task.priority}">${task.priority}</span> 
                <div class="task-actions"> 
                    <button class="complete-btn">${task.isComplete ? 'Undo' : 'Complete'}</button> 
                    <button class="edit-btn">Edit</button> 
                    <button class="delete-btn">Delete</button> 
                </div> 
            `; 
            taskList.appendChild(li); 
        }); 
    } 
 
    // Public API 
    return { 
        initialize: function() { 
            initializeEventListeners(); 
            taskManager.loadTasks(); // Load and render tasks on app start 
        }, 
        renderTasks // Expose render for external calls if needed (e.g., after sort) 
    }; 
})(); 
 
// Initialize the application 
document.addEventListener('DOMContentLoaded', uiManager.initialize); 
