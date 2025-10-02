import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Page Not Found</h2>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}

export default NotFound;
