// src/reducers/todos.reducer.js

export const actions = {
  fetchTodos: "fetchTodos",
  loadTodos: "loadTodos",
  setLoadError: "setLoadError",
  startRequest: "startRequest",
  addTodo: "addTodo",
  endRequest: "endRequest",
  updateTodo: "updateTodo",
  completeTodo: "completeTodo",
  revertTodo: "revertTodo",
  clearError: "clearError",
};

export const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: "",
  sortField: "createdTime",
  sortDirection: "desc",
  queryString: "",
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return { ...state, isLoading: true, errorMessage: "" };

    case actions.loadTodos:
      return {
        ...state,
        isLoading: false,
        todoList: action.records.map((record) => {
          const todo = { id: record.id, ...record.fields };
          if (!todo.isCompleted) todo.isCompleted = false;
          return todo;
        }),
      };

    case actions.setLoadError:
      return { ...state, isLoading: false, errorMessage: action.error.message };

    case actions.startRequest:
      return { ...state, isSaving: true };

    case actions.addTodo: {
      const record = action.record;
      const savedTodo = { id: record.id, ...record.fields };
      if (!savedTodo.isCompleted) savedTodo.isCompleted = false;

      return {
        ...state,
        isSaving: false,
        todoList: [...state.todoList, savedTodo],
      };
    }

    case actions.endRequest:
      return { ...state, isLoading: false, isSaving: false };

    case actions.updateTodo:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.editedTodo.id ? action.editedTodo : todo
        ),
        errorMessage: action.error ? action.error.message : state.errorMessage,
      };

    case actions.revertTodo:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.originalTodo.id ? action.originalTodo : todo
        ),
      };

    case actions.completeTodo:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.id ? { ...todo, isCompleted: true } : todo
        ),
      };

    case actions.clearError:
      return { ...state, errorMessage: "" };

    default:
      return state;
  }
}
