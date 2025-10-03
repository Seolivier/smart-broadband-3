import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Create({ setView, editClientId }) {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', location: '',
    service_type: '', price: '', serial_number: '',
    supporter: '', has_bonus: false
  });

  useEffect(() => {
    if (editClientId) {
      axios.get(`${apiUrl}/api/clients?page=1&limit=1000`)
        .then(res => {
          const client = res.data.data.find(c => c.id === editClientId);
          if (client) setForm(client);
        }).catch(console.error);
    }
  }, [editClientId]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editClientId) {
        await axios.put(`${apiUrl}/api/clients/${editClientId}`, form);
      } else {
        await axios.post(`${apiUrl}/api/clients`, form);
      }
      setView('clients');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="left-form" onSubmit={handleSubmit}>
      <label>Full Name
        <input name="full_name" value={form.full_name} onChange={handleChange} required />
      </label>
      <label>Email
        <input name="email" value={form.email} onChange={handleChange} />
      </label>
      <label>Phone
        <input name="phone" value={form.phone} onChange={handleChange} />
      </label>
      <label>Location
        <input name="location" value={form.location} onChange={handleChange} />
      </label>
      <label>Service Type
        <input name="service_type" value={form.service_type} onChange={handleChange} />
      </label>
      <label>Price
        <input name="price" type="number" value={form.price} onChange={handleChange} />
      </label>
      <label>Serial Number
        <input name="serial_number" value={form.serial_number} onChange={handleChange} />
      </label>
      <label>Supporter
        <input name="supporter" value={form.supporter} onChange={handleChange} />
      </label>
      <label>Has Bonus
        <input type="checkbox" name="has_bonus" checked={form.has_bonus} onChange={handleChange} />
      </label>
      <button type="submit" className="add-client-btn">{editClientId ? 'Update Client' : 'Add Client'}</button>
    </form>
  );
}



