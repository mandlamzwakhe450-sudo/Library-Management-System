import { useState, useEffect } from "react";

const emptyForm = { title: "", author: "", genre: "", isbn: "", quantity: "" };

// Used for BOTH adding a new book and updating an existing one.
// If "editingBook" is given, the form is filled with that book.
function BookForm({ books, editingBook, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // When the user clicks "Update" on a row, fill the form
  useEffect(() => {
    if (editingBook) {
      setForm({ ...editingBook, quantity: String(editingBook.quantity) });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editingBook]);

  // One function handles all inputs (controlled components)
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const newErrors = {};
    if (form.title.trim() === "") newErrors.title = "Title is required.";
    if (form.author.trim() === "") newErrors.author = "Author is required.";
    if (form.genre.trim() === "") newErrors.genre = "Genre is required.";

    const cleanIsbn = form.isbn.replace(/-/g, "").trim();
    if (!/^(\d{10}|\d{13})$/.test(cleanIsbn)) {
      newErrors.isbn = "ISBN must be 10 or 13 digits.";
    } else {
      // ISBN must not be used by another book
      const duplicate = books.find(
        (b) => b.isbn === cleanIsbn && (!editingBook || b.id !== editingBook.id)
      );
      if (duplicate) newErrors.isbn = "This ISBN already exists.";
    }

    const qty = Number(form.quantity);
    if (form.quantity === "" || !Number.isInteger(qty) || qty < 0) {
      newErrors.quantity = "Quantity must be a whole number (0 or more).";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // stop if there are errors

    onSave({
      ...form,
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim(),
      isbn: form.isbn.replace(/-/g, "").trim(),
      quantity: Number(form.quantity),
    });
    if (!editingBook) setForm(emptyForm);
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2>{editingBook ? "Update book" : "Add a new book"}</h2>

      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} />
        {errors.title && <span className="error">{errors.title}</span>}
      </label>

      <label>
        Author
        <input name="author" value={form.author} onChange={handleChange} />
        {errors.author && <span className="error">{errors.author}</span>}
      </label>

      <label>
        Genre
        <input name="genre" value={form.genre} onChange={handleChange} />
        {errors.genre && <span className="error">{errors.genre}</span>}
      </label>

      <label>
        ISBN
        <input name="isbn" value={form.isbn} onChange={handleChange} placeholder="10 or 13 digits" />
        {errors.isbn && <span className="error">{errors.isbn}</span>}
      </label>

      <label>
        {editingBook ? "Quantity in stock" : "Initial quantity"}
        <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} />
        {errors.quantity && <span className="error">{errors.quantity}</span>}
      </label>

      <div className="row">
        <button type="submit" className="btn">{editingBook ? "Save changes" : "Add book"}</button>
        {editingBook && (
          <button type="button" className="btn light" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}

export default BookForm;
