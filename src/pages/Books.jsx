import { useState } from "react";
import BookForm from "../components/BookForm";
import StockBadge from "../components/StockBadge";

function Books({ books, onAdd, onUpdate, onDelete }) {
  // the book currently being edited (null = adding a new one)
  const [editingBook, setEditingBook] = useState(null);
  const [message, setMessage] = useState("");

  function handleSave(book) {
    if (editingBook) {
      onUpdate(book);
      setEditingBook(null);
      setMessage("Book updated.");
    } else {
      onAdd(book);
      setMessage("Book added.");
    }
  }

  function handleDelete(book) {
    if (window.confirm('Delete "' + book.title + '"? This cannot be undone.')) {
      onDelete(book.id);
      if (editingBook && editingBook.id === book.id) setEditingBook(null);
      setMessage("Book deleted.");
    }
  }

  return (
    <section>
      <h2>Book management</h2>
      {message && <p className="success">{message}</p>}

      <div className="two-col">
        <BookForm
          books={books}
          editingBook={editingBook}
          onSave={handleSave}
          onCancel={() => setEditingBook(null)}
        />

        <div className="card table-wrap">
          {books.length === 0 ? (
            <p className="empty">No books yet. Use the form to add the first one.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Qty</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>
                      {book.title}
                      <div className="sub">{book.genre} <StockBadge quantity={book.quantity} /></div>
                    </td>
                    <td>{book.author}</td>
                    <td>{book.isbn}</td>
                    <td>{book.quantity}</td>
                    <td className="actions">
                      <button className="btn small" onClick={() => { setEditingBook(book); setMessage(""); }}>
                        Update
                      </button>
                      <button className="btn small danger" onClick={() => handleDelete(book)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

export default Books;
