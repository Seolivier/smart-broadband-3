import React, { useState, useEffect } from 'react';

export default function Edit({ client, onCancel, onSaved }) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    location: '',
    phone: '',
    service_type: 'Starlink Mini', // default
    price: '',
    serial_number: '',
    supporter: '',
    has_bonus: false,
    bonus_amount: '',
  });

  useEffect(() => {
    if (client && client.id) {
      setForm({
        full_name: client.full_name || '',
        email: client.email || '',
        location: client.location || '',
        phone: client.phone || '',
        service_type: client.service_type || 'Starlink Mini',
        price: client.price ? client.price.toString() : '',
        serial_number: client.serial_number || '',
        supporter: client.supporter || '',
        has_bonus: client.has_bonus || false,
        bonus_amount: client.bonus_amount ? client.bonus_amount.toString() : '',
      });
    } else {
      setForm({
        full_name: '',
        email: '',
        location: '',
        phone: '',
        service_type: 'Starlink Mini',
        price: '',
        serial_number: '',
        supporter: '',
        has_bonus: false,
        bonus_amount: '',
      });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Local API URL only
  const API_URL = 'http://localhost:4000';

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      full_name: form.full_name,
      email: form.email,
      location: form.location,
      phone: form.phone,
      service_type: form.service_type,
      price: parseFloat(form.price),
      serial_number: ['Starlink Mini', 'Starlink Standard'].includes(form.service_type)
        ? form.serial_number
        : null,
      supporter: form.supporter || null,
      has_bonus: form.has_bonus,
      bonus_amount: form.has_bonus ? parseFloat(form.bonus_amount) : null,
    };

    const method = client && client.id ? 'PUT' : 'POST';
    const url = client.id
  ? `${API_URL}/api/clients/${client.id}`
  : `${API_URL}/api/clients`;


    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Saved successfully');
        onSaved();
      } else {
        const errorData = await res.json();
        alert('Error: ' + (errorData.error || JSON.stringify(errorData)));
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <h2>{client && client.id ? 'Edit Client' : 'Add New Client'}</h2>

      <label>
        Full Name:<br />
        <input
          type="text"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
        />
      </label><br />

      <label>
        Email:<br />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </label><br />

      <label>
        Location:<br />
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
        />
      </label><br />

      <label>
        Phone:<br />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </label><br />

      <label>
        Service Type:<br />
        <select
          name="service_type"
          value={form.service_type}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Service Type --</option>
          <option value="Starlink Mini">Starlink Mini</option>
          <option value="Starlink Standard">Starlink Standard</option>
          <option value="4G SIM Card">4G SIM Card</option>
          <option value="GPS Truck Service">GPS Truck Service</option>
        </select>
      </label><br />

      <label>
        Price:<br />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
        />
      </label><br />

      {['Starlink Mini', 'Starlink Standard'].includes(form.service_type) && (
        <>
          <label>
            Serial Number:<br />
            <input
              type="text"
              name="serial_number"
              value={form.serial_number}
              onChange={handleChange}
              required
            />
          </label><br />
        </>
      )}

      <label>
        Supporter:<br />
        <input
          type="text"
          name="supporter"
          value={form.supporter}
          onChange={handleChange}
          placeholder="Optional"
        />
      </label><br />

      <label>
        <input
          type="checkbox"
          name="has_bonus"
          checked={form.has_bonus}
          onChange={handleChange}
        />
        {' '}Has Bonus?
      </label><br />

      {form.has_bonus && (
        <label>
          Bonus Amount:<br />
          <input
            type="number"
            name="bonus_amount"
            value={form.bonus_amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </label>
      )}

      <br />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>
        Cancel
      </button>
    </form>
  );
}