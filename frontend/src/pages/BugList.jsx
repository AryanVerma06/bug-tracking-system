// pages/BugList.js — View All Bugs with Filters
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [editingBug, setEditingBug] = useState(null);

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/bugs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBugs(res.data);
    } catch (err) {
      console.error('Error fetching bugs:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bugId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/bugs/${bugId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBugs(bugs.map(b => b._id === bugId ? { ...b, status: newStatus } : b));
      setEditingBug(null);
    } catch (err) {
      console.error('Error updating bug:', err);
    }
  };

  const deleteBug = async (bugId) => {
    if (!window.confirm('Are you sure you want to delete this bug?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/bugs/${bugId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBugs(bugs.filter(b => b._id !== bugId));
    } catch (err) {
      console.error('Error deleting bug:', err);
      alert('Only Admins can delete bugs.');
    }
  };

  // Apply filters
  const filtered = bugs.filter(b => {
    const matchSeverity = filterSeverity === 'All' || b.severity === filterSeverity;
    const matchStatus = filterStatus === 'All' || b.status === filterStatus;
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase());
    return matchSeverity && matchStatus && matchSearch;
  });

  const getSeverityBadge = (severity) => {
    const map = { Critical: 'badge-critical', Major: 'badge-major', Minor: 'badge-minor' };
    const icons = { Critical: '🔴', Major: '🟡', Minor: '🔵' };
    return <span className={`badge ${map[severity]}`}>{icons[severity]} {severity}</span>;
  };

  const getStatusBadge = (status) => {
    const map = { 'Open': 'status-open', 'In Progress': 'status-inprogress', 'Resolved': 'status-resolved', 'Closed': 'status-closed' };
    return <span className={`badge ${map[status]}`}>{status}</span>;
  };

  const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
  const role = localStorage.getItem('role');

  if (loading) return <div className="loading">Loading bugs...</div>;

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Bug Tracker</h1>
          <p className="page-subtitle">Showing {filtered.length} of {bugs.length} bugs</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.location.href = '/create-bug'}>
          ➕ Report Bug
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          className="form-input search-input"
          placeholder="🔍 Search bugs by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-input"
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          style={{ maxWidth: '160px' }}
        >
          <option value="All">All Severity</option>
          <option value="Critical">🔴 Critical</option>
          <option value="Major">🟡 Major</option>
          <option value="Minor">🔵 Minor</option>
        </select>
        <select
          className="form-input"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ maxWidth: '170px' }}
        >
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
        {(filterSeverity !== 'All' || filterStatus !== 'All' || search) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setFilterSeverity('All'); setFilterStatus('All'); setSearch(''); }}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Bug Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Module</th>
                <th>Assigned To</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="empty-state">
                      <div className="empty-icon">🐛</div>
                      <div>No bugs match your filters.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((bug, index) => (
                  <tr key={bug._id}>
                    <td style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '12px' }}>
                      {index + 1}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {bug.title}
                      </div>
                      {bug.reporterName && (
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                          by {bug.reporterName}
                        </div>
                      )}
                    </td>
                    <td>{getSeverityBadge(bug.severity)}</td>
                    <td>
                      {editingBug === bug._id ? (
                        <select
                          className="form-input"
                          style={{ maxWidth: '140px', padding: '4px 8px', fontSize: '12px' }}
                          value={bug.status}
                          onChange={(e) => updateStatus(bug._id, e.target.value)}
                          onBlur={() => setEditingBug(null)}
                          autoFocus
                        >
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span onClick={() => setEditingBug(bug._id)} style={{ cursor: 'pointer' }}>
                          {getStatusBadge(bug.status)}
                        </span>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{bug.module || '—'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{bug.assignedTo}</td>
                    <td style={{ color: 'var(--text-dim)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {new Date(bug.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {role === 'Admin' && (
                        <button className="btn btn-danger btn-sm" onClick={() => deleteBug(bug._id)}>
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BugList;
