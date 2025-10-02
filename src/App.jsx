// src/App.jsx
import { useEffect, useCallback, useReducer, useState } from "react";
import { Routes, Route, useLocation, Form } from "react-router-dom";
import './App.css';
import Header from "./shared/Header";
import TodosPage from "./pages/TodosPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from "./reducers/todos.reducer";

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const [title, setTitle] = useState("Todo List");

  const location = useLocation();

  // Airtable API setup
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // encodeUrl for fetching
  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${todoState.sortField}&sort[0][direction]=${todoState.sortDirection}`;
    let searchQuery = "";

    if (todoState.queryString) {
      searchQuery = `&filterByFormula=SEARCH("${todoState.queryString}", title)`;
    }

    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [todoState.sortField, todoState.sortDirection, todoState.queryString]);

  // Load todos
  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });

      const options = {
        method: "GET",
        headers: { Authorization: token },
      };

      try {
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) throw new Error(resp.message);

        const { records } = await resp.json();
        dispatch({ type: todoActions.loadTodos, records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error });
      }
    };

    fetchTodos();
  }, [encodeUrl]);

  // Add new todo
  const addTodo = async (title) => {
    const newTodo = { title, isCompleted: false };
    const payload = {
      records: [
        { fields: { title: newTodo.title, isCompleted: newTodo.isCompleted } },
      ],
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
      dispatch({ type: todoActions.startRequest });

      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) throw new Error(resp.message);

      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, record: records[0] });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  // Update todo (optimistic)
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoState.todoList.find(
      (todo) => todo.id === editedTodo.id
    );

    dispatch({ type: todoActions.updateTodo, editedTodo });

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };
    const options = {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) throw new Error(resp.message);
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, originalTodo, error });
    }
  };

  // Complete todo (optimistic)
  const completeTodo = async (todoId) => {
    const originalTodo = todoState.todoList.find((todo) => todo.id === todoId);

    dispatch({ type: todoActions.completeTodo, id: todoId });

    const payload = { records: [{ id: todoId, fields: { isCompleted: true } }] };
    const options = {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) throw new Error(resp.message);
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, originalTodo, error });
    }
  };

  // Update page title based on route
  useEffect(() => {
    if (location.pathname === "/") {
      setTitle("Todo List");
    } else if (location.pathname === "/about") {
      setTitle("About");
    } else {
      setTitle("Not Found");
    }
  }, [location]);

  return (
    <div>
      <Header title={title} />

      <Routes>
        <Route
          path="/"
          element={
            <TodosPage
              todoState={todoState}
              dispatch={dispatch}
              addTodo={addTodo}
              updateTodo={updateTodo}
              completeTodo={completeTodo}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
