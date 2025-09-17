import { useState, useEffect } from "react";

function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  // Local state for debounce
  const [localQueryString, setLocalQueryString] = useState(queryString);

  // Prevent form refresh
  const preventRefresh = (e) => e.preventDefault();

  // Debounce search input 
  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);

  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label>Search todos: </label>
        <input
          type="text"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setLocalQueryString("")} // clears input
        >
          Clear
        </button>
      </div>

      <br />

      <div>
        <label>Sort by: </label>
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time Added</option>
        </select>
      </div>

      <br />

      <div>
        <label>Direction: </label>
        <select
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </form>
  );
}

export default TodosViewForm;
