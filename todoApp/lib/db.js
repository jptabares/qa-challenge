import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'todos.json');

function ensureDbExists() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
  }
}

export function getTodos() {
  ensureDbExists();
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

export function addTodo(text) {
  ensureDbExists();
  const todos = getTodos();
  const newTodo = {
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  };
  todos.push(newTodo);
  fs.writeFileSync(DB_PATH, JSON.stringify(todos, null, 2));
  return newTodo;
}

export function deleteTodo(id) {
  ensureDbExists();
  const todos = getTodos();
  const filtered = todos.filter(todo => todo.id !== id);
  fs.writeFileSync(DB_PATH, JSON.stringify(filtered, null, 2));
  return filtered;
}
