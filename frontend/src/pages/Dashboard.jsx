// pages/Dashboard.js — Bug Statistics & Charts
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, bugsRes] = await Promise.all([
        axios.get('/api/bugs/stats', { headers }),
        axios.get('/api/bugs', { headers })
      ]);

      setStats(statsRes.data);
      setBugs(bugsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const statusData = [
    { name: 'Open', value: stats?.open || 0 },
    { name: 'In Progress', value: stats?.inProgress || 0 },
    { name: 'Resolved', value: stats?.resolved || 0 },
    { name: 'Closed', value: stats?.closed || 0 }
  ];

  const severityData = [
    { name: 'Critical', count: stats?.critical || 0 },
    { name: 'Major', count: stats?.major || 0 },
    { name: 'Minor', count: stats?.minor || 0 }
  ];

  const PIE_COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#64748b'];
  const BAR_COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];

  const total = stats?.total || 0;
  const resolutionRate = total > 0
    ? Math.round(((stats?.resolved || 0) + (stats?.closed || 0)) / total * 100)
    : 0;

  const statCards = [
    { label: 'Total Bugs', value: total, icon: '📦', color: '#3b82f6' },
    { label: 'Open', value: stats?.open || 0, icon: '🔴', color: '#ef4444' },
    { label: 'In Progress', value: stats?.inProgress || 0, icon: '🟡', color: '#f59e0b' },
    { label: 'Resolved', value: stats?.resolved || 0, icon: '✅', color: '#22c55e' }
  ];

  const getSeverityBadge = (severity) => {
    const map = { Critical: 'badge-critical', Major: 'badge-major', Minor: 'badge-minor' };
    const icons = { Critical: '🔴', Major: '🟡', Minor: '🔵' };
    return <span className={`badge ${map[severity] || 'badge-minor'}`}>{icons[severity]} {severity}</span>;
  };

  const getStatusBadge = (status) => {
    const map = { 'Open': 'status-open', 'In Progress': 'status-inprogress', 'Resolved': 'status-resolved', 'Closed': 'status-closed' };
    return <span className={`badge ${map[status] || 'status-open'}`}>{status}</span>;
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of bug tracking statistics</p>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        {statCards.map((card, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon" style={{ background: `${card.color}18` }}>
              {card.icon}
            </div>
            <div>
              <div className="stat-value" style={{ color: card.color }}>{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="chart-grid">
        {/* Severity Bar Chart */}
        <div className="chart-card">
          <div className="chart-title">Bugs by Severity</div>
          <div className="chart-subtitle">Distribution across Critical, Major, and Minor</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={severityData}>
              <XAxis dataKey="name" tick={{ fill: '#8b9dc3', fontSize: 12 }} />
              <YAxis tick={{ fill: '#4a6080', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1e2d42', borderRadius: '8px', color: '#e2e8f0' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                {severityData.map((_, index) => (
                  <Cell key={index} fill={BAR_COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie Chart */}
        <div className="chart-card">
          <div className="chart-title">Bug Status</div>
          <div className="chart-subtitle">Current sprint status breakdown</div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1e2d42', borderRadius: '8px', color: '#e2e8f0' }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', color: '#8b9dc3' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Resolution Rate: </span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#4ade80' }}>{resolutionRate}%</span>
          </div>
        </div>
      </div>

      {/* Recent Bugs Table */}
      <div className="card">
        <div className="table-header">
          <span className="table-title">Recent Bug Reports</span>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{bugs.length} total</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bugs.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <div className="empty-icon">🐛</div>
                      <div>No bugs reported yet. Start by reporting one!</div>
                    </div>
                  </td>
                </tr>
              ) : (
                bugs.slice(0, 8).map((bug) => (
                  <tr key={bug._id}>
                    <td style={{ fontWeight: 600, maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {bug.title}
                    </td>
                    <td>{getSeverityBadge(bug.severity)}</td>
                    <td>{getStatusBadge(bug.status)}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{bug.assignedTo}</td>
                    <td style={{ color: 'var(--text-dim)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {new Date(bug.createdAt).toLocaleDateString()}
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

export default Dashboard;
