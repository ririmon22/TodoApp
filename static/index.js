const API_URL = '/todos';

window.onload = () => {
    fetchTodos();
};

async function fetchTodos() {
    console.log('Fetching todos...');
    try{
        const response = await fetch(API_URL);
        if (!response.ok){
            throw new Error('Failed to fetch todos');
        }
        const todos = await response.json();
        console.log('Fetched todos:', todos);

        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '';

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = `${todo.id}: ${todo.title} - ${todo.completed ? 'Completed': 'Not ompleted'}`;
            todoList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

document.getElementById('todo-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('From submitted');

    const title = document.getElementById('todo-title').value;
    const dueDate = document.getElementById('todo-due-date').value;
    const priority = document.getElementById('todo-priority').value;
    console.log('Adding Todo:', title);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title: title, completed: false, due_date: dueDate, priority: priority}),
        });

        if (response.ok){
            console.log('Todo added successfully');
            fetchTodos();
            document.getElementById('todo-title').value = '';
            document.getElementById('todo-due-date').value = '';
            document.getElementById('todo-priority').value = 'Low';
        } else {
            const errorText = await response.text();
            console.error('Failed to add todo:', response, errorText);
        }
    } catch (error){
        console.error('Error adding todo:', error);
    }
});