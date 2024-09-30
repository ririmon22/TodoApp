const API_URL = '/todos';

window.onload = () => {
    displayTodayDate();  // ページロード時に日付を表示
    fetchTodos();        // ToDoを取得して表示
};

// 日付をフォーマットする関数
function formatDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月は0から始まるので+1
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

// 今日の日付を表示する関数
function displayTodayDate() {
    const today = new Date();
    const formattedDate = formatDate(today);
    document.getElementById("current-date").innerText = `${formattedDate}`;
}

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

            // チェックボックスを作成
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => {
                toggleTodoCompletion(todo.id, checkbox.checked);
                // チェックボックスの状態に応じて取り消し線を追加/削除
                if (checkbox.checked) {
                    li.classList.add('completed');
                } else {
                    li.classList.remove('completed');
                }
            });

            // ToDoテキストを設定し、チェックボックスを先頭に配置
            li.textContent = `${todo.title} - ${todo.priority}`;
            li.prepend(checkbox); // チェックボックスを前に配置

            // 完了しているToDoには初期から取り消し線を引く
            if (todo.completed) {
                li.classList.add('completed');
            }
            
            //更新ボタンを追加
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.onclick = () => updateTodo(todo.id, todo.completed);
            li.appendChild(updateButton);

            todoList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

document.getElementById('todo-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Form submitted');

    const title = document.getElementById('todo-title').value;
    const priority = document.getElementById('todo-priority').value;
    console.log('Adding Todo:', title);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title: title, completed: false, priority: priority}),
        });

        if (response.ok){
            console.log('Todo added successfully');
            fetchTodos();
            document.getElementById('todo-title').value = '';
            document.getElementById('todo-priority').value = 'Low';
        } else {
            const errorText = await response.text();
            console.error('Failed to add todo:', response, errorText);
        }
    } catch (error){
        console.error('Error adding todo:', error);
    }
});

// ToDoの完了状態を更新
async function toggleTodoCompletion(id, completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({completed: completed}),
        });

        if (!response.ok) {
            throw new Error('Failed to update todo');
        }

        console.log(`Todo with ID ${id} updated`);
        fetchTodos(); // 状態を更新した後に再取得してリストを更新
    } catch(error){
        console.error('Error updating todo:', error);
    }
}

document.querySelector('button[type="button"]').addEventListener('click', () => {
    deleteCompletedTodos();
});

async function deleteCompletedTodos() {
    console.log('Deleting completed todos...');
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            console.log('Todo deleted successfull');
            fetchTodos();
        } else {
            const errorMessage = await response.text();
            console.error('Failed to delete todo:', response, errorMessage);
        }
    } catch (error) {
        console.error('Error deleting completed todos:', error);
    }
}

async function updateTodo(id, completed) {
    const title = prompt('Enter new title:');
    const priority = prompt('Enter new priority (Low, Medium, High):');
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: id, title: title, completed: completed, priority: priority}),
        });

        if (response.ok) {
            console.log('Todo updated successfully');
            fetchTodos();
        } else {
            const errorMessage = await response.text();
            console.error('Failed to update todo:', response,errorMessage);
        }
    } catch(error){
        console.error('Error updating todo:',error);
    }
}
