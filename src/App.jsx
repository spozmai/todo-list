
import './App.css'

function App() {
  const todos = [
{id :1, title: "study"},
{id :2, title: "work"},
{id :3, title: "coding"},
  ]

  return (
<div>
  <h1>My Todos</h1>
     <ul>
          {todos.map(todo => <li key={todo.id}>{todo.title}</li>)}
     </ul>
  </div>
  )
}

export default App
