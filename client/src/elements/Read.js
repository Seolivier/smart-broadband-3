import React, { useEffect, useState } from 'react';

export default function Read({ onEdit, refresh, onRefresh }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use environment variable if set, else fallback to localhost
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/clients`);
      if (!res.ok) throw new Error('Failed to fetch clients');
      const data = await res.json();
      setClients(data);
      onRefresh && onRefresh();
    } catch (error) {
      alert('Error fetching clients: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [refresh]);

  const deleteClient = async (id) => {
    if (!window.confirm('Delete this client?')) return;

    try {
      const res = await fetch(`${API_URL}/api/clients/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Client deleted');
        onRefresh && onRefresh();
        fetchClients();
      } else {
        alert('Failed to delete client');
      }
    } catch (error) {
      alert('Error deleting client: ' + error.message);
    }
  };

  if (loading) return <p>Loading clients...</p>;

  return (
    <div>
      <button onClick={() => onEdit({})} style={{ marginBottom: '1rem' }}>
        Add New Client
      </button>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#eee' }}>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Location</th>
            <th>Phone</th>
            <th>Service Type</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>
                No clients found.
              </td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.full_name}</td>
                <td>{client.email}</td>
                <td>{client.location}</td>
                <td>{client.phone}</td>
                <td>{client.service_type}</td>
                <td>{Number(client.price).toFixed(2)}</td>
                <td>
                  <button onClick={() => onEdit(client)}>Edit</button>{' '}
                  <button onClick={() => deleteClient(client.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}









