import { useState, useEffect } from "react";

const emptyForm = { name: "", membershipId: "", role: "Member", password: "" };

function UserForm({ users, editingUser, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingUser) {
      // leave password blank so it is only changed if the admin types a new one
      setForm({ ...editingUser, password: "" });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editingUser]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const newErrors = {};
    if (form.name.trim() === "") newErrors.name = "Name is required.";

    const id = form.membershipId.trim();
    if (id === "") {
      newErrors.membershipId = "Membership ID is required.";
    } else {
      const duplicate = users.find(
        (u) =>
          u.membershipId.toLowerCase() === id.toLowerCase() &&
          (!editingUser || u.id !== editingUser.id)
      );
      if (duplicate) newErrors.membershipId = "This membership ID is already used.";
    }

    // password is required for new users, optional when editing
    if (!editingUser && form.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters.";
    }
    if (editingUser && form.password !== "" && form.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters.";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const user = {
      ...form,
      name: form.name.trim(),
      membershipId: form.membershipId.trim(),
      // keep the old password if the box was left empty
      password: form.password === "" && editingUser ? editingUser.password : form.password,
    };
    onSave(user);
    if (!editingUser) setForm(emptyForm);
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2>{editingUser ? "Update user" : "Add a new user"}</h2>

      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}
      </label>

      <label>
        Membership ID
        <input name="membershipId" value={form.membershipId} onChange={handleChange} />
        {errors.membershipId && <span className="error">{errors.membershipId}</span>}
      </label>

      <label>
        Role
        <select name="role" value={form.role} onChange={handleChange}>
          <option>Admin</option>
          <option>Librarian</option>
          <option>Member</option>
        </select>
      </label>

      <label>
        {editingUser ? "New password (leave empty to keep the old one)" : "Password"}
        <input name="password" type="password" value={form.password} onChange={handleChange} />
        {errors.password && <span className="error">{errors.password}</span>}
      </label>

      <div className="row">
        <button type="submit" className="btn">{editingUser ? "Save changes" : "Add user"}</button>
        {editingUser && (
          <button type="button" className="btn light" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}

export default UserForm;
