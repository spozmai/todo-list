
import './App.css' 
import TodoList from './TodoList'
import TodoForm from './TodoForm';

function App() {
  const todos = [
{id :1, title: "study"},
{id :2, title: "work"},
{id :3, title: "coding"},
  ];

  return (
<div>
  <h1>My Todos</h1>
  <TodoForm/>
  <TodoList todos={todos}/>
     
  </div>
  );
}

export default App;
