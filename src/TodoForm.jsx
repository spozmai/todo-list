import { useState, useRef } from "react";

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const todoTitleInput = useRef("");

  function handleAddTodo(event) {
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle(""); 
    todoTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <input
        type="text"
        name="title"
        ref={todoTitleInput}
        placeholder="Enter a todo"
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
      />
      <button type="submit" disabled={workingTodoTitle.trim() === ""}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
