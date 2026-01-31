'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const res = await fetch('/api/todos/');
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!newTodo.trim()) {
      setError('Please enter a todo item');
      return;
    }

    if (newTodo.trim().length < 3) {
      setError('Todo must be at least 3 characters long');
      return;
    }

    try {
      const res = await fetch('/api/todos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to add todo. Please try again.');
        return;
      }
      setTodos([...todos, data]);
      setNewTodo('');
    } catch (err) {
      setError('Failed to add todo. Please try again.');
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/todos/?id=${id}`, {
        method: 'DELETE',
      });
      const updatedTodos = await res.json();
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Todo List</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => {
            setNewTodo(e.target.value);
            if (error) setError('');
          }}
          placeholder="Add a new todo..."
          style={styles.input}
          testid="new-todo-input"
        />
        <button type="submit" style={styles.button} testid="add-todo-button">
          Add
        </button>
      </form>

      {error && (
        <p style={styles.error} testid="error-message">{error}</p>
      )}

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <ul style={styles.list} testid="todo-list">
          {todos.length === 0 ? (
            <p style={styles.empty}>No todos yet. Add one above!</p>
          ) : (
            todos.map((todo) => (
              <li key={todo.id} style={styles.item}>
                <span style={styles.text}>{todo.text}</span>
                <button
                  onClick={() => handleDelete(todo.id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '20px',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px 15px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '5px',
    outline: 'none',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  text: {
    flex: 1,
    fontSize: '16px',
  },
  deleteBtn: {
    padding: '5px 15px',
    fontSize: '14px',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  error: {
    color: '#ff4444',
    fontSize: '14px',
    marginTop: '-10px',
    marginBottom: '15px',
  },
};
