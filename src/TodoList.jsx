import TodoListItem from "./TodoListItem";

function TodoList() {
  const todos = [
    { id: 1, title: "study" },
    { id: 2, title: "work" },
    { id: 3, title: "coding" },
  ];
    return(
    <ul>
      {todos.map(todo => (
            <TodoListItem key={todo.id} todo={todo} />
      ))}
    </ul>
    );
}
export default TodoList
 