import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Read({ clientId, setView }) {
  const [client, setClient] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (clientId) {
      axios.get(`${apiUrl}/api/clients?page=1&limit=1000`)
        .then(res => {
          const c = res.data.data.find(cl => cl.id === clientId);
          if (c) setClient(c);
        }).catch(console.error);
    }
  }, [clientId]);

  if (!client) return <div className="no-data">Client data not found.</div>;

  return (
    <div className="left-form">
      <h3>Client Details</h3>
      <p><strong>Name:</strong> {client.full_name}</p>
      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>Phone:</strong> {client.phone}</p>
      <p><strong>Location:</strong> {client.location}</p>
      <p><strong>Service Type:</strong> {client.service_type}</p>
      <p><strong>Price:</strong> {client.price}</p>
      <p><strong>Serial Number:</strong> {client.serial_number}</p>
      <p><strong>Supporter:</strong> {client.supporter}</p>
      <p><strong>Has Bonus:</strong> {client.has_bonus ? 'Yes' : 'No'}</p>
      <button className="add-client-btn" onClick={() => setView('clients')}>Back to List</button>
    </div>
  );
}











