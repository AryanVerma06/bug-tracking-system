// pages/CreateBug.js — Bug Reporting Form
import React, { useState } from 'react';
import axios from 'axios';

const CreateBug = () => {
  const [bug, setBug] = useState({
    title: '',
    description: '',
    severity: '',
    assignedTo: '',
    module: '',
    environment: 'Development',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setBug({ ...bug, [e.target.name]: e.target.value });
  };

  const selectSeverity = (severity) => {
    setBug({ ...bug, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!bug.title || !bug.description || !bug.severity) {
      setError('Please fill in Title, Description, and Severity.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/bugs', bug, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Bug reported successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = '/bugs';
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error reporting bug.');
    } finally {
      setLoading(false);
    }
  };

  const severities = [
    { value: 'Critical', emoji: '🔴', color: '#ef4444', desc: 'System crash, data loss, security breach' },
    { value: 'Major', emoji: '🟡', color: '#f59e0b', desc: 'Core feature broken, no workaround' },
    { value: 'Minor', emoji: '🔵', color: '#3b82f6', desc: 'Minor UX issue, cosmetic bug' }
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Report a Bug</h1>
        <p className="page-subtitle">Fill out the details below to submit a new bug report</p>
      </div>

      <div className="report-form">
        <div className="card" style={{ padding: '2rem' }}>
          {error && <div className="alert alert-error">⚠️ {error}</div>}
          {success && <div className="alert alert-success">✅ {success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Bug Title */}
            <div className="form-group">
              <label className="form-label">Bug Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. 'Login crashes on iOS Safari 16'"
                value={bug.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                className="form-input"
                placeholder="Detailed description of the bug and its impact..."
                value={bug.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            {/* Severity Selection */}
            <div className="form-group">
              <label className="form-label">Severity *</label>
              <div className="severity-grid">
                {severities.map((s) => (
                  <div
                    key={s.value}
                    className={`severity-card ${bug.severity === s.value ? `selected-${s.value.toLowerCase()}` : ''}`}
                    onClick={() => selectSeverity(s.value)}
                  >
                    <div className="severity-emoji">{s.emoji}</div>
                    <div className="severity-label" style={{ color: s.color }}>{s.value}</div>
                    <div className="severity-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Module & Environment */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Module / Component</label>
                <select name="module" className="form-input" value={bug.module} onChange={handleChange}>
                  <option value="">-- Select Module --</option>
                  <option>Authentication</option>
                  <option>Dashboard</option>
                  <option>Notifications</option>
                  <option>Bug List</option>
                  <option>Reports</option>
                  <option>User Profile</option>
                  <option>Backend/API</option>
                  <option>Settings</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Environment</label>
                <select name="environment" className="form-input" value={bug.environment} onChange={handleChange}>
                  <option>Development</option>
                  <option>Staging</option>
                  <option>Production</option>
                  <option>UAT</option>
                </select>
              </div>
            </div>

            {/* Assigned To */}
            <div className="form-group">
              <label className="form-label">Assign To (Developer Name)</label>
              <input
                type="text"
                name="assignedTo"
                className="form-input"
                placeholder="Enter developer name"
                value={bug.assignedTo}
                onChange={handleChange}
              />
            </div>

            {/* Steps to Reproduce */}
            <div className="form-group">
              <label className="form-label">Steps to Reproduce</label>
              <textarea
                name="stepsToReproduce"
                className="form-input"
                placeholder={"1. Navigate to the login page\n2. Enter valid credentials\n3. Click 'Sign In'\n4. Observe the error"}
                value={bug.stepsToReproduce}
                onChange={handleChange}
                rows={4}
                style={{ fontFamily: 'monospace' }}
              />
            </div>

            {/* Expected vs Actual */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Expected Behavior</label>
                <textarea
                  name="expectedBehavior"
                  className="form-input"
                  placeholder="What should happen?"
                  value={bug.expectedBehavior}
                  onChange={handleChange}
                  rows={3}
                  style={{ borderColor: 'rgba(34, 197, 94, 0.3)' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Actual Behavior</label>
                <textarea
                  name="actualBehavior"
                  className="form-input"
                  placeholder="What actually happens?"
                  value={bug.actualBehavior}
                  onChange={handleChange}
                  rows={3}
                  style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading || !bug.title || !bug.description || !bug.severity}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? '⏳ Submitting...' : '🐛 Submit Bug Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBug;
