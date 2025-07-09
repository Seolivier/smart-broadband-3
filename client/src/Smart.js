import React, { useState, useEffect, useRef } from 'react';
import './main.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const CLIENTS_PER_PAGE = 5;

export default function Smart() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    starlink_type: 'Starlink Mini',
    price: '',
    serial_number: '',
    supporter: '',
    has_bonus: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('list');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reminders state
  const [reminders, setReminders] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Ref for detecting clicks outside notifications panel
  const notifRef = useRef(null);

  const showSerial = form.starlink_type === 'Starlink Mini' || form.starlink_type === 'Starlink Standard';

  // Fetch clients when currentPage changes or when view switches to list
  useEffect(() => {
    if (view === 'list') {
      fetchClients(currentPage);
    }
  }, [currentPage, view]);

  // Fetch reminders once on component mount
  useEffect(() => {
    async function fetchReminders() {
      try {
        const res = await fetch(`${API_URL}/api/reminders`);
        const data = await res.json();
        if (data.reminders && data.reminders.length > 0) {
          setReminders(data.reminders);
        }
      } catch (error) {
        console.error('Error fetching reminders:', error);
      }
    }
    fetchReminders();
  }, []);

  // Close notifications panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  async function fetchClients(page = 1) {
    setLoadingClients(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/clients?page=${page}&limit=${CLIENTS_PER_PAGE}`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to fetch clients');
      setClients(result.data);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err.message);
      setClients([]); // clear clients on error
      setTotalPages(1);
    } finally {
      setLoadingClients(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleEdit(client) {
    setForm({
      full_name: client.full_name,
      email: client.email,
      phone: client.phone,
      location: client.location,
      starlink_type: client.starlink_type,
      price: client.price,
      serial_number: client.serial_number || '',
      supporter: client.supporter || '',
      has_bonus: client.has_bonus || false,
    });
    setEditingId(client.id);
    setView('form');
    setError('');
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    setLoadingClients(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/clients/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to delete client');
      } else {
        if (clients.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchClients(currentPage);
        }
      }
    } catch (err) {
      setError('Network error while deleting client');
    } finally {
      setLoadingClients(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (
      !form.full_name ||
      !form.email ||
      !form.phone ||
      !form.location ||
      !form.starlink_type ||
      form.price === ''
    ) {
      return setError('Please fill all required fields');
    }
    if (isNaN(form.price) || Number(form.price) < 0) {
      return setError('Price must be a non-negative number');
    }

    setSubmitting(true);
    try {
      const url = editingId ? `${API_URL}/api/clients/${editingId}` : `${API_URL}/api/clients`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok)
        return setError(data.error || (editingId ? 'Failed to update client' : 'Failed to add client'));

      alert(editingId ? 'Client updated successfully!' : 'Client added successfully!');

      setForm({
        full_name: '',
        email: '',
        phone: '',
        location: '',
        starlink_type: 'Starlink Mini',
        price: '',
        serial_number: '',
        supporter: '',
        has_bonus: false,
      });
      setEditingId(null);
      setView('list');
      setCurrentPage(1);
      fetchClients(1);
    } catch (err) {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  }

  function handleViewChange(newView) {
    setError('');
    setView(newView);
    if (newView === 'list') {
      setCurrentPage(1);
    }
    if (newView === 'form') {
      setEditingId(null);
      setForm({
        full_name: '',
        email: '',
        phone: '',
        location: '',
        starlink_type: 'Starlink Mini',
        price: '',
        serial_number: '',
        supporter: '',
        has_bonus: false,
      });
    }
  }

  return (
    <div className="container" style={{ position: 'relative' }}>
      {/* Notification Button */}
      <div 
        ref={notifRef} 
        style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000, cursor: 'pointer' }}
      >
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          style={{
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            color: 'white',
            fontSize: '18px',
            position: 'relative',
          }}
          aria-label="Toggle notifications"
          title="Notifications"
        >
          🔔
          {reminders.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {reminders.length}
            </span>
          )}
        </button>

        {/* Notifications Panel */}
        {showNotifications && (
          <div
            style={{
              marginTop: '10px',
              width: '300px',
              maxHeight: '300px',
              overflowY: 'auto',
              backgroundColor: 'white',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              borderRadius: '5px',
              padding: '10px',
              color: '#333',
              fontSize: '14px',
            }}
          >
            <strong>Subscription Reminders</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              {reminders.length === 0 ? (
                <li>No new reminders</li>
              ) : (
                reminders.map((msg, idx) => <li key={idx}>{msg}</li>)
              )}
            </ul>
          </div>
        )}
      </div>

      <h2>Smart Broadband Clients</h2>

      <div className="toggle-buttons">
        <button
          className="clients-btn"
          onClick={() => handleViewChange('form')}
          disabled={view === 'form'}
        >
          {editingId ? 'Edit Client' : 'Add Client'}
        </button>
        <button
          className="clients-btn"
          onClick={() => handleViewChange('list')}
          disabled={view === 'list'}
        >
          View Clients
        </button>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="flex-container">
        {view === 'form' && (
          <form className="left-form" onSubmit={handleSubmit}>
            <label>
              Full Name *
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email *
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Phone *
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Location *
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Starlink Type *
              <select
                name="starlink_type"
                value={form.starlink_type}
                onChange={handleChange}
                required
              >
                <option>Starlink Mini</option>
                <option>Starlink Standard</option>
                <option>Starlink Premium</option>
              </select>
            </label>
            <label>
              Price *
              <input
                type="number"
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>
            {showSerial && (
              <label>
                Serial Number
                <input
                  type="text"
                  name="serial_number"
                  value={form.serial_number}
                  onChange={handleChange}
                />
              </label>
            )}
            <label>
              Supporter
              <input
                type="text"
                name="supporter"
                value={form.supporter}
                onChange={handleChange}
              />
            </label>
            <div>
              <input
                type="checkbox"
                name="has_bonus"
                checked={form.has_bonus}
                onChange={handleChange}
              />{' '}
              Has Bonus
            </div>
            <button type="submit" disabled={submitting} className="add-client-btn">
              {submitting
                ? editingId
                  ? 'Updating...'
                  : 'Adding...'
                : editingId
                ? 'Update Client'
                : 'Add Client'}
            </button>
          </form>
        )}

        {view === 'list' && (
          <div className="client-list">
            <h3>Clients List</h3>
            {loadingClients ? (
              <p>Loading clients...</p>
            ) : (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Serial #</th>
                      <th>Supporter</th>
                      <th>Bonus</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="no-data">
                          No clients found
                        </td>
                      </tr>
                    ) : (
                      clients.map(client => (
                        <tr key={client.id}>
                          <td>{client.full_name}</td>
                          <td>{client.email}</td>
                          <td>{client.phone}</td>
                          <td>{client.location}</td>
                          <td>{client.starlink_type}</td>
                          <td>{Number(client.price).toFixed(2)}</td>
                          <td>{client.serial_number || ''}</td>
                          <td>{client.supporter || ''}</td>
                          <td>{client.has_bonus ? 'Yes' : 'No'}</td>
                          <td>
                            <button
                              className="edit-btn"
                              onClick={() => handleEdit(client)}
                            >
                              Edit
                            </button>{' '}
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(client.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
