# Community Library Management System

Library-Management-System - Web Development individual assignment 2

React + React Router + Local Storage.

## How to run
1. Install Node.js (version 18 or newer)
2. In this folder run:
   npm install
   npm run dev
3. Open the link shown in the terminal (usually http://localhost:5173)

## First login
Membership ID: ADMIN01
Password: admin123

## Where each requirement is
- useState / useEffect:    src/hooks/useLocalStorage.js, all forms
- Component composition:   src/components (Navbar, BookForm, UserForm, LoginForm, StockBadge)
- Forms + validation:      BookForm, UserForm, LoginForm, Transactions page
- React Router:            src/main.jsx (BrowserRouter) and src/App.jsx (Routes)
- Local Storage:           src/hooks/useLocalStorage.js (keys: lib_books, lib_users, lib_transactions, lib_currentUser)
