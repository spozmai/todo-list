import { useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    font-style: italic;  // ✅ requirement from assignment
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");

  const handleAddTodo = (event) => {
    event.preventDefault();
    if (!workingTodoTitle.trim()) return;
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle("");
  };

  return (
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todo-input"
        label="Todo"
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />
      <StyledButton type="submit" disabled={!workingTodoTitle.trim()}>
        {isSaving ? "Saving..." : "Add Todo"}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;
