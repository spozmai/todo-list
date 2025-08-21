import { useState } from "react";
import TodoList from './features/TodoList/TodoList';
import TodoListItem from './features/TodoList/TodoListItem';
import TodoForm from "./features/TodoForm";

function App() {
  const [todoList, setTodoList] = useState([]);

  // Add a new todo
  const addTodo = (title) => {
    const newTodo = {
      id: Date.now(),
      title,
      isCompleted: false,
    };
    setTodoList([...todoList, newTodo]);
  };

  // Mark todo as complete
  const completeTodo = (todoId) => {
    const updatedTodos = todoList.map((todo) =>
      todo.id === todoId ? { ...todo, isCompleted: true } : todo
    );
    setTodoList(updatedTodos);
  };

  // Update todo title
  const updateTodo = (editedTodo) => {
    const updatedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo
    );
    setTodoList(updatedTodos);
  };

  return (
    <div>
      <h1>Todo App</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default App;
