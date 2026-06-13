import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5063/api/todos";
// Backend API URL

function App() {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    const response = await fetch(API_URL);
    const data = await response.json();
    setTodos(data);
  }

  async function handleAddTodo(event) {
    event.preventDefault();

    if (title.trim() === "") {
      return;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        isCompleted: false,
      }),
    });

    const createdTodo = await response.json();

    setTodos([...todos, createdTodo]);
    setTitle("");
  }

  async function handleToggleTodo(todo) {
  await fetch(`${API_URL}/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: todo.id,
      title: todo.title,
      isCompleted: !todo.isCompleted,
    }),
  });

  setTodos(
    todos.map((item) =>
      item.id === todo.id
        ? { ...item, isCompleted: !item.isCompleted }
        : item
    )
  );
}

async function handleDeleteTodo(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  setTodos(todos.filter((todo) => todo.id !== id));
}

  return (
    <main className="app">
      <section className="todo-panel">
        <h1>Todo List</h1>

        <form className="todo-form" onSubmit={handleAddTodo}>
          <input
            type="text"
            placeholder="Enter a task"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        {todos.length === 0 ? (
          <p className="empty-message">No tasks yet.</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <label className="todo-check">
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => handleToggleTodo(todo)}
                  />
                  <span className={todo.isCompleted ? "completed" : ""}>
                    {todo.title}
                  </span>
                </label>

                <div className="todo-actions">
                  <span>{todo.isCompleted ? "Done" : "Pending"}</span>
                  <button type="button" onClick={() => handleDeleteTodo(todo.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;