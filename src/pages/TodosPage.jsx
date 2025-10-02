import TodoForm from "../features/TodoList/TodoForm";
import TodoList from "../features/TodoList/TodoList";
import TodosViewForm from "../features/TodoList/TodosViewForm";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function TodosPage({
  todoState,
  addTodo,
  updateTodo,
  completeTodo,
  setSortField,
  setSortDirection,
  setQueryString,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Assignment requires 15 items per page
  const todosPerPage = 15;

  // Read current page from URL, default to 1
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Pagination logic
  const indexOfLast = currentPage * todosPerPage;
  const indexOfFirst = indexOfLast - todosPerPage;
  const currentTodos = todoState.todoList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(todoState.todoList.length / todosPerPage);

  // Handlers update the URL param instead of local state
  const nextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams({ page: (currentPage + 1).toString() });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: (currentPage - 1).toString() });
    }
  };

  // Protect against invalid params
  useEffect(() => {
    if (totalPages > 0) {
      if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
        navigate("/");
      }
    }
  }, [currentPage, totalPages, navigate]);

  return (
    <div>
      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
      <TodoList
        todoList={currentTodos}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
      />
      <TodosViewForm
        sortField={todoState.sortField}
        setSortField={setSortField}
        sortDirection={todoState.sortDirection}
        setSortDirection={setSortDirection}
        queryString={todoState.queryString}
        setQueryString={setQueryString}
      />

      {/* Pagination Controls */}
      <div style={{ marginTop: "1rem" }}>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span style={{ margin: "0 1rem" }}>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default TodosPage;
