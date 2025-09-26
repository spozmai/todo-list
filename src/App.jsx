import { useEffect, useCallback, useReducer } from "react";
import TodoList from "./features/TodoList/TodoList";
import TodoForm from "./features/TodoList/TodoForm";
import TodosViewForm from "./features/TodoList/TodosViewForm";
import styles from "./App.module.css";
import "./App.css";

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from "./reducers/todos.reducer";

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // useCallback encodeUrl replaces old utility
  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${todoState.sortField}&sort[0][direction]=${todoState.sortDirection}`;
    let searchQuery = "";

    if (todoState.queryString) {
      searchQuery = `&filterByFormula=SEARCH("${todoState.queryString}", title)`;
    }

    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [todoState.sortField, todoState.sortDirection, todoState.queryString]);

  // Load todos from Airtable
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

  return (
    <div className={styles.container}>
      <div className={styles.appBox}>
        <h1>Todo App</h1>
        <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />

        <TodoList
          todoList={todoState.todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          isLoading={todoState.isLoading}
        />

        <hr />

        <TodosViewForm
          sortField={todoState.sortField}
          setSortField={(field) =>
            dispatch({
              type: "SET_SORT",
              payload: { field, direction: todoState.sortDirection },
            })
          }
          sortDirection={todoState.sortDirection}
          setSortDirection={(direction) =>
            dispatch({
              type: "SET_SORT",
              payload: { field: todoState.sortField, direction },
            })
          }
          queryString={todoState.queryString}
          setQueryString={(query) =>
            dispatch({ type: "SET_QUERY", payload: query })
          }
        />

        {todoState.errorMessage && (
          <div>
            <hr />
            <p style={{ color: "black" }}>{todoState.errorMessage}</p>
            <button onClick={() => dispatch({ type: todoActions.clearError })}>
              Dismiss Error Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
