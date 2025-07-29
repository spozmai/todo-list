import './App.css';
import { useState } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

function App() {
  const [newTodo, setNewTodo] = useState("Example Todo");

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <p> {newTodo} </p>
      <TodoList />
    </div>
  );
}

export default App;
