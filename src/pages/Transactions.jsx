import { useState } from "react";

function Transactions({ books, users, transactions, onTransaction }) {
  const [bookId, setBookId] = useState("");
  const [type, setType] = useState("borrow");
  const [quantity, setQuantity] = useState("1");
  const [memberId, setMemberId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setSuccess("");

    // validation
    const qty = Number(quantity);
    if (bookId === "") return setError("Please choose a book.");
    if (!Number.isInteger(qty) || qty < 1) return setError("Quantity must be a whole number of at least 1.");
    if (type === "borrow" && memberId === "") return setError("Please choose who is borrowing the book.");

    const problem = onTransaction({
      bookId: Number(bookId),
      type: type,
      quantity: qty,
      memberId: type === "borrow" ? memberId : "",
    });

    if (problem) {
      setError(problem);
    } else {
      setError("");
      setSuccess(type === "add" ? "Stock added." : "Book borrowed. Stock updated.");
      setQuantity("1");
    }
  }

  return (
    <section>
      <h2>Transactions</h2>

      <div className="two-col">
        <form className="card form" onSubmit={handleSubmit} noValidate>
          <h2>Record a transaction</h2>

          <label>
            Type
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="borrow">Borrow (deduct stock)</option>
              <option value="add">New arrival (add stock)</option>
            </select>
          </label>

          <label>
            Book
            <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
              <option value="">-- choose a book --</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} (in stock: {b.quantity})
                </option>
              ))}
            </select>
          </label>

          {type === "borrow" && (
            <label>
              Member
              <select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
                <option value="">-- choose a member --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.membershipId}>
                    {u.name} ({u.membershipId})
                  </option>
                ))}
              </select>
            </label>
          )}

          <label>
            Quantity
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </label>

          {error && <span className="error">{error}</span>}
          {success && <span className="success">{success}</span>}

          <button type="submit" className="btn">Save transaction</button>
        </form>

        <div className="card table-wrap">
          <h2>History</h2>
          {transactions.length === 0 ? (
            <p className="empty">No transactions yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Book</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>Member</th>
                  <th>Done by</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td>{t.bookTitle}</td>
                    <td>{t.type === "add" ? "+ Added" : "- Borrowed"}</td>
                    <td>{t.quantity}</td>
                    <td>{t.memberId}</td>
                    <td>{t.doneBy}</td>
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

export default Transactions;
