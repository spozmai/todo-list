import TodoListItem from "./TodoListItem";

function TodoList({ todoList, onCompleteTodo }) {
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  return (
    filteredTodoList.length === 0 ? (
      <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        Add todo above to get started
      </p>
    ) : (
      <ul>
        {filteredTodoList.map((todo) => (
          <TodoListItem
            key={todo.id}
            todo={todo}
            onCompleteTodo={onCompleteTodo}
          />
        ))}
      </ul>
    )
  );
}

export default TodoList;
