import { useState, useEffect } from "react";
import TodoList from './features/TodoList/TodoList';
import TodoForm from "./features/TodoForm";
import TodoListItem from "./features/TodoList/TodoListItem";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // Load todos from Airtable
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const options = {
        method: "GET",
        headers: { Authorization: token },
      };

      try {
        const resp = await fetch(url, options);
        if (!resp.ok) throw new Error(resp.message);

        const { records } = await resp.json();
        setTodoList(
          records.map((record) => {
            const todo = { id: record.id, ...record.fields };
            if (!todo.isCompleted) todo.isCompleted = false;
            return todo;
          })
        );
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Add new todo (pessimistic)
  const addTodo = async (title) => {
    const newTodo = { title, isCompleted: false };
    const payload = {
      records: [{ fields: { title: newTodo.title, isCompleted: newTodo.isCompleted } }],
    };
    const options = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.message);

      const { records } = await resp.json();
      const savedTodo = { id: records[0].id, ...records[0].fields };
      if (!records[0].fields.isCompleted) savedTodo.isCompleted = false;

      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Update todo (optimistic)
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    const updatedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? editedTodo : todo
    );
    setTodoList(updatedTodos);

    const payload = {
      records: [
        { id: editedTodo.id, fields: { title: editedTodo.title, isCompleted: editedTodo.isCompleted } },
      ],
    };
    const options = {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.message);
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      const revertedTodos = todoList.map((todo) =>
        todo.id === originalTodo.id ? originalTodo : todo
      );
      setTodoList(revertedTodos);
    }
  };

  // Complete todo (optimistic)
  const completeTodo = async (todoId) => {
    const originalTodo = todoList.find((todo) => todo.id === todoId);
    const updatedTodos = todoList.map((todo) =>
      todo.id === todoId ? { ...todo, isCompleted: true } : todo
    );
    setTodoList(updatedTodos);

    const payload = { records: [{ id: todoId, fields: { isCompleted: true } }] };
    const options = {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.message);
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      const revertedTodos = todoList.map((todo) =>
        todo.id === originalTodo.id ? originalTodo : todo
      );
      setTodoList(revertedTodos);
    }
  };

  return (
    <div>
      <h1>Todo App</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />

      {errorMessage && (
        <div>
          <hr />
          <p style={{ color: "black" }}>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss Error Message</button>
        </div>
      )}
    </div>
  );
}

export default App;
