import { useState } from "react";
import StockBadge from "../components/StockBadge";

function Dashboard({ books }) {
  const [search, setSearch] = useState("");

  const lowStockBooks = books.filter((b) => b.quantity < 2);
  const totalCopies = books.reduce((sum, b) => sum + b.quantity, 0);

  // filter by title or author
  const shownBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section>
      <h2>Dashboard</h2>

      <div className="stats">
        <div className="card stat">
          <strong>{books.length}</strong>
          <span>Book titles</span>
        </div>
        <div className="card stat">
          <strong>{totalCopies}</strong>
          <span>Copies in stock</span>
        </div>
        <div className={lowStockBooks.length > 0 ? "card stat warn" : "card stat"}>
          <strong>{lowStockBooks.length}</strong>
          <span>Low stock (fewer than 2)</span>
        </div>
      </div>

      <input
        className="search"
        placeholder="Search by title or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {shownBooks.length === 0 ? (
        <p className="empty">No books found. Add some on the Books page.</p>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Available</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {shownBooks.map((book) => (
                <tr key={book.id} className={book.quantity < 2 ? "low-row" : ""}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.quantity}</td>
                  <td><StockBadge quantity={book.quantity} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Dashboard;
