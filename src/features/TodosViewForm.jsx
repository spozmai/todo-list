// added search field + clear button
function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString, 
  setQueryString, 
}) {
  const preventRefresh = (e) => e.preventDefault();

  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label>
          Search todos:{" "}
          <input
            type="text"
            value={queryString}
            onChange={(e) => setQueryString(e.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={() => setQueryString("")} // Clear search
          style={{ marginLeft: "0.5rem" }}
        >
          Clear
        </button>
      </div>

      <br />

      <div>
        <label>
          Sort by{" "}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
          </select>
        </label>

        <label style={{ marginLeft: "1rem" }}>
          Direction{" "}
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
    </form>
  );
}

export default TodosViewForm;
