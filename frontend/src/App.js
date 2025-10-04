import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
/* import Login from './pages/Login';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import AddBook from './pages/AddBook'; */

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/" element={<BookList />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/add-book" element={<AddBook />} /> */}
      </Routes>
    </Router>
  );
}

export default App;