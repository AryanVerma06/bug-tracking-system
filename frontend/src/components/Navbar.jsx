// components/Navbar.js — Navigation Sidebar (Role-Aware)
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name') || 'User';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const roleColors = { Admin: '#8b5cf6', Developer: '#3b82f6', Tester: '#10b981' };
  const avatarColor = roleColors[role] || '#3b82f6';

  const links = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/bugs', icon: '🐛', label: 'All Bugs' },
    { path: '/create-bug', icon: '➕', label: 'Report Bug' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">🐛</div>
        <span className="navbar-title">BugTracker</span>
      </div>

      <div className="navbar-links">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="navbar-user">
        <div className="user-info-card">
          <div className="user-avatar" style={{ background: avatarColor }}>
            {initials}
          </div>
          <div>
            <div className="user-name">{name}</div>
            <div className="user-role">{role}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
