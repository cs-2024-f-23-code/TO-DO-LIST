// Get DOM elements
        const taskInput = document.getElementById('taskInput');
        const addButton = document.getElementById('addButton');
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        const totalTasks = document.getElementById('totalTasks');
        const completedTasks = document.getElementById('completedTasks');
        const pendingTasks = document.getElementById('pendingTasks');
        
        // Load tasks from localStorage or use empty array
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        
        // Initialize the app
        function init() {
            updateStats();
            renderTasks();
            
            // Focus on input
            taskInput.focus();
            
            // Add event listeners
            addButton.addEventListener('click', addTask);
            taskInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') addTask();
            });
            
            // Event delegation for task actions
            taskList.addEventListener('click', handleTaskActions);
        }
        
        // Add a new task
        function addTask() {
            const text = taskInput.value.trim();
            if (!text) return;
            
            const newTask = {
                id: Date.now(),
                text: text,
                completed: false,
                date: new Date().toLocaleDateString()
            };
            
            tasks.push(newTask);
            saveTasks();
            taskInput.value = '';
            renderTasks();
        }
        
        // Handle task actions (edit, delete, complete)
        function handleTaskActions(e) {
            const taskElement = e.target.closest('.task-item');
            if (!taskElement) return;
            
            const taskId = parseInt(taskElement.dataset.id);
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            
            // Handle checkbox click
            if (e.target.classList.contains('task-checkbox')) {
                tasks[taskIndex].completed = e.target.checked;
                saveTasks();
                renderTasks();
            }
            
            // Handle edit button click
            if (e.target.classList.contains('btn-edit')) {
                const newText = prompt('Edit task:', tasks[taskIndex].text);
                if (newText && newText.trim()) {
                    tasks[taskIndex].text = newText.trim();
                    saveTasks();
                    renderTasks();
                }
            }
            
            // Handle delete button click
            if (e.target.classList.contains('btn-delete')) {
                if (confirm('Delete this task?')) {
                    tasks.splice(taskIndex, 1);
                    saveTasks();
                    renderTasks();
                }
            }
        }
        
        // Render all tasks
        function renderTasks() {
            // Clear the list
            taskList.innerHTML = '';
            
            // Show empty state if no tasks
            if (tasks.length === 0) {
                emptyState.style.display = 'block';
                return;
            }
            
            // Hide empty state
            emptyState.style.display = 'none';
            
            // Create task elements
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = 'task-item';
                taskElement.dataset.id = task.id;
                
                taskElement.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                    <div class="task-actions">
                        <button class="btn-icon btn-edit" title="Edit">✏️</button>
                        <button class="btn-icon btn-delete" title="Delete">🗑️</button>
                    </div>
                `;
                
                taskList.appendChild(taskElement);
            });
            
            updateStats();
        }
        
        // Update statistics
        function updateStats() {
            const completed = tasks.filter(t => t.completed).length;
            const pending = tasks.length - completed;
            
            totalTasks.textContent = tasks.length;
            completedTasks.textContent = completed;
            pendingTasks.textContent = pending;
        }
        
        // Save tasks to localStorage
        function saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
        
        // Start the app
        init();