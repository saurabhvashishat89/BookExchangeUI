import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const userId=localStorage.getItem('userId');
  console.log(userId)
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    bookcondition: '',
    availabilityStatus: '',
    userId:userId,
  });
  const navigate = useNavigate();

  // Fetch email on component mount
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      navigate('/');
    }
    setEmail(userEmail);
  }, [navigate]);

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Fetch search results
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Please enter a title to search.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/books/search?title=${searchTerm}`);
      if (!response.ok) throw new Error('Failed to fetch search results.');
      const data = await response.json();
      setSearchResults(data['content']);
    } catch (error) {
      console.error(error);
      alert('Error fetching search results.');
    }
  };

  // Handle adding a book
  const handleAddBook = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      });
      if (!response.ok) throw new Error('Failed to add book.');
      alert('Book added successfully.');
      setNewBook({ title: '', author: '', genre: '', bookcondition: '', availabilityStatus: '' });
      handleSearch();
    } catch (error) {
      console.error(error);
      alert('Error adding book.');
    }
  };

  // Handle updating book availability
  const handleUpdateBook = async (bookId, updatedStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availabilityStatus: updatedStatus }),
      });
      if (!response.ok) throw new Error('Failed to update book.');
      alert('Book updated successfully.');
      handleSearch();
    } catch (error) {
      console.error(error);
      alert('Error updating book.');
    }
  };

  // Handle deleting a book
  const handleDeleteBook = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/books/${bookId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete book.');
      alert('Book deleted successfully.');
      handleSearch();
    } catch (error) {
      console.error(error);
      alert('Error deleting book.');
    }
  };

  // Handle password reset
  const handleResetPassword = async () => {
    const newPassword = prompt('Enter your new password:');
    const oldPassword = prompt('Enter your old password:');
    if (!newPassword) return;
    try {
      const response = await fetch('http://localhost:8080/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', email, newPassword,oldPassword},
        // body: JSON.stringify({ newPassword: nPassword,oldPassword: oPassword }),
      });
      if (!response.ok) throw new Error('Failed to reset password.');
      alert('Password reset successfully.');
    } catch (error) {
      console.error(error);
      alert('Error resetting password.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '10px 20px', backgroundColor: '#f0f0f0', borderRadius: '20px' }}>{email}</div>
          <button onClick={handleResetPassword} style={buttonStyle}>Reset Password</button>
          <button onClick={handleLogout} style={{ ...buttonStyle, backgroundColor: '#FF4136' }}>Logout</button>
        </div>
      </header>

      {/* Search Section */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Search for books"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleSearch} style={buttonStyle}>Search</button>
      </div>

      {/* Add Book Section */}
      <div style={{ marginTop: '20px' }}>
        <h3>Add a Book</h3>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Genre"
          value={newBook.genre}
          onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Book Condition"
          value={newBook.bookcondition}
          onChange={(e) => setNewBook({ ...newBook, bookcondition: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Availability Status"
          value={newBook.availabilityStatus}
          onChange={(e) => setNewBook({ ...newBook, availabilityStatus: e.target.value })}
          onChange1={(e) => setNewBook({ ...newBook, user: userId })}
        
          style={inputStyle}
        />
        <button onClick={handleAddBook} style={buttonStyle}>Add Book</button>
      </div>

      {/* Book List */}
      <div style={{ marginTop: '20px' }}>
        {searchResults.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Condition</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.bookcondition}</td>
                  <td>{book.availabilityStatus}</td>
                  <td>
                    <button
                      onClick={() => handleUpdateBook(book.id, 'Available')}
                      style={buttonStyle}
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      style={{ ...buttonStyle, backgroundColor: '#FF4136' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 15px',
  margin: '5px',
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const inputStyle = {
  padding: '10px',
  margin: '5px',
  width: '200px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '10px',
};

export default Dashboard;
