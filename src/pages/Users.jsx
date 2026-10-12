import { useState } from "react";
import LoginForm from "../components/LoginForm";
import UserForm from "../components/UserForm";

function Users({ users, currentUser, onLogin, onAdd, onUpdate, onDelete }) {
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState("");

  // 1) Not logged in -> show the login form
  if (!currentUser) {
    return (
      <section>
        <h2>User login</h2>
        <LoginForm onLogin={onLogin} />
      </section>
    );
  }

  // 2) Logged in but not an admin -> no access to the admin view
  if (currentUser.role !== "Admin") {
    return (
      <section>
        <h2>User management</h2>
        <p className="empty">
          You are logged in as {currentUser.name} ({currentUser.role}).
          Only admins can manage users.
        </p>
      </section>
    );
  }

  // 3) Admin view
  function handleSave(user) {
    if (editingUser) {
      onUpdate(user);
      setEditingUser(null);
      setMessage("User updated.");
    } else {
      onAdd(user);
      setMessage("User added.");
    }
  }

  function handleDelete(user) {
    if (user.id === currentUser.id) {
      setMessage("You cannot delete the account you are logged in with.");
      return;
    }
    if (window.confirm("Delete user " + user.name + "?")) {
      onDelete(user.id);
      setMessage("User deleted.");
    }
  }

  return (
    <section>
      <h2>User management</h2>
      {message && <p className="success">{message}</p>}

      <div className="two-col">
        <UserForm
          users={users}
          editingUser={editingUser}
          onSave={handleSave}
          onCancel={() => setEditingUser(null)}
        />

        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Membership ID</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.membershipId}</td>
                  <td>{user.role}</td>
                  <td className="actions">
                    <button className="btn small" onClick={() => { setEditingUser(user); setMessage(""); }}>
                      Update
                    </button>
                    <button className="btn small danger" onClick={() => handleDelete(user)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Users;
