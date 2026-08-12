const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const progressBar = document.getElementById('progressBar');
const statsText = document.getElementById('statsText');
const clearBtn = document.getElementById('clearBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
let currentFilter = 'all';

function saveAndRender() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    
    // Filtrar tareas según la opción seleccionada
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // 'all'
    });

    filteredTasks.forEach((task) => {
        // Encontrar el índice real de la tarea en el arreglo original
        const originalIndex = tasks.indexOf(task);

        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(originalIndex));

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        span.addEventListener('click', () => toggleTask(originalIndex));

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = '✕';
        delBtn.addEventListener('click', () => deleteTask(originalIndex));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        taskList.appendChild(li);
    });

    updateProgress();
}

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;
    tasks.push({ text: text, completed: false });
    taskInput.value = '';
    saveAndRender();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRender();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveAndRender();
}

function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressBar.style.width = percentage + '%';
    progressBar.textContent = percentage + '%';
    statsText.textContent = `${completed} de ${total} tareas completadas`;
}

// Lógica de los botones de filtro
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

clearBtn.addEventListener('click', () => {
    if (tasks.length === 0) return;
    if (confirm('¿Deseas eliminar todas las tareas?')) {
        tasks = [];
        saveAndRender();
    }
});

renderTasks();
