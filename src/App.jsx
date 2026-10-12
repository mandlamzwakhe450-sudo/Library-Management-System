import { Routes, Route, Navigate } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";

// Starting data (only used the first time the app runs)
const starterBooks = [
  { id: 1, title: "Things Fall Apart", author: "Chinua Achebe", genre: "Fiction", isbn: "9780385474542", quantity: 5 },
  { id: 2, title: "A Brief History of Time", author: "Stephen Hawking", genre: "Science", isbn: "9780553380163", quantity: 1 },
  { id: 3, title: "Long Walk to Freedom", author: "Nelson Mandela", genre: "Biography", isbn: "9780316548182", quantity: 3 },
];

const starterUsers = [
  { id: 1, name: "Head Librarian", membershipId: "ADMIN01", role: "Admin", password: "admin123" },
];

function App() {
  // All the data lives here and is saved to local storage
  const [books, setBooks] = useLocalStorage("lib_books", starterBooks);
  const [users, setUsers] = useLocalStorage("lib_users", starterUsers);
  const [transactions, setTransactions] = useLocalStorage("lib_transactions", []);
  const [currentUser, setCurrentUser] = useLocalStorage("lib_currentUser", null);

  // ---------- Book functions ----------
  function addBook(book) {
    setBooks([...books, { ...book, id: Date.now() }]);
  }

  function updateBook(updatedBook) {
    setBooks(books.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
  }

  function deleteBook(id) {
    setBooks(books.filter((b) => b.id !== id));
  }

  // ---------- Transaction function ----------
  // Returns an error message (string) or "" if everything worked
  function addTransaction({ bookId, type, quantity, memberId }) {
    const book = books.find((b) => b.id === bookId);
    if (!book) return "Book not found.";

    let newQuantity = book.quantity;
    if (type === "add") {
      newQuantity = book.quantity + quantity;
    } else {
      if (quantity > book.quantity) {
        return "Not enough copies in stock. Only " + book.quantity + " left.";
      }
      newQuantity = book.quantity - quantity;
    }

    // update stock
    setBooks(books.map((b) => (b.id === bookId ? { ...b, quantity: newQuantity } : b)));

    // save to history (we keep the title in case the book is deleted later)
    const record = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      bookId: bookId,
      bookTitle: book.title,
      type: type,
      quantity: quantity,
      memberId: memberId || "-",
      doneBy: currentUser ? currentUser.name : "-",
    };
    setTransactions([record, ...transactions]);
    return "";
  }

  // ---------- User functions ----------
  function addUser(user) {
    setUsers([...users, { ...user, id: Date.now() }]);
  }

  function updateUser(updatedUser) {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    // if I edited myself, update the logged-in info too
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  }

  function deleteUser(id) {
    setUsers(users.filter((u) => u.id !== id));
  }

  // ---------- Login / logout ----------
  function login(membershipId, password) {
    const found = users.find(
      (u) => u.membershipId.toLowerCase() === membershipId.toLowerCase() && u.password === password
    );
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  }

  function logout() {
    setCurrentUser(null);
  }

  // If nobody is logged in, send them to the login page
  function protect(page) {
    return currentUser ? page : <Navigate to="/users" replace />;
  }

  return (
    <>
      <Navbar currentUser={currentUser} onLogout={logout} />
      <main className="container">
        <Routes>
          <Route path="/" element={protect(<Dashboard books={books} />)} />
          <Route
            path="/books"
            element={protect(
              <Books books={books} onAdd={addBook} onUpdate={updateBook} onDelete={deleteBook} />
            )}
          />
          <Route
            path="/transactions"
            element={protect(
              <Transactions books={books} users={users} transactions={transactions} onTransaction={addTransaction} />
            )}
          />
          <Route
            path="/users"
            element={
              <Users
                users={users}
                currentUser={currentUser}
                onLogin={login}
                onAdd={addUser}
                onUpdate={updateUser}
                onDelete={deleteUser}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
