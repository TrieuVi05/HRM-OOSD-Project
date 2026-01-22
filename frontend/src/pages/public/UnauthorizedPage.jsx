import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <Link to="/">Back to home</Link>
    </div>
  );
}
