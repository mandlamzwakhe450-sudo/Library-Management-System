import { NavLink } from "react-router-dom";

function Navbar({ currentUser, onLogout }) {
  return (
    <header className="navbar">
      <h1 className="logo">Community Library</h1>
      <nav>
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/users">{currentUser ? "Users" : "Login"}</NavLink>
      </nav>
      {currentUser && (
        <div className="who">
          <span>{currentUser.name} ({currentUser.role})</span>
          <button className="btn small light" onClick={onLogout}>Log out</button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
