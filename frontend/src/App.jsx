import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateBug from './pages/CreateBug';
import BugList from './pages/BugList';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="app">
        {token && <Navbar />}
        <div className={token ? 'main-content' : 'auth-wrapper'}>
          <Routes>
            <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/create-bug" element={token ? <CreateBug /> : <Navigate to="/login" />} />
            <Route path="/bugs" element={token ? <BugList /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
