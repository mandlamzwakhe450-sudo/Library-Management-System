import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm({ onLogin }) {
  const [membershipId, setMembershipId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (membershipId.trim() === "" || password === "") {
      setError("Please enter your membership ID and password.");
      return;
    }

    const ok = onLogin(membershipId.trim(), password);
    if (ok) {
      navigate("/"); // go to the dashboard
    } else {
      setError("Wrong membership ID or password.");
    }
  }

  return (
    <form className="card form login" onSubmit={handleSubmit} noValidate>
      <h2>Log in</h2>
      <label>
        Membership ID
        <input value={membershipId} onChange={(e) => setMembershipId(e.target.value)} />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <span className="error">{error}</span>}
      <button type="submit" className="btn">Log in</button>
      <p className="hint">First time? Use ID <b>ADMIN01</b> and password <b>admin123</b>.</p>
    </form>
  );
}

export default LoginForm;
