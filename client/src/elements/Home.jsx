import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000'; // Local backend URL

export default function Home() {
  const [totalClients, setTotalClients] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTotalClients() {
      try {
        const res = await fetch(`${API_URL}/api/clients`);
        if (!res.ok) throw new Error('Failed to fetch clients');
        const clients = await res.json();
        setTotalClients(clients.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTotalClients();
  }, []);

  return (
    <div className="container">
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#005f73' }}>Smart Broadband Management</h1>

        <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1rem' }}>
          Manage your Starlink and broadband clients easily.
        </p>

        {loading && <p style={{ textAlign: 'center' }}>Loading client data...</p>}

        {error && (
          <div className="error" style={{ textAlign: 'center', color: 'red' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && totalClients !== null && (
          <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#005f73' }}>
            Total Registered Clients: {totalClients}
          </p>
        )}

        <div className="form-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button
            className="btn-primary"
            onClick={() => navigate('/smart')}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: '#0a9396',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Go to Client Management
          </button>
        </div>
      </div>
    </div>
  );
}





























