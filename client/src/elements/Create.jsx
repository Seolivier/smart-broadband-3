import React, { useState } from 'react';
import axios from 'axios';

const Create = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    service_type: '',
    price: '',
    serial_number: '',
    supporter: '',
    has_bonus: false,
  });

  const apiUrl = 'http://localhost:4000';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload with proper types
    const payload = {
      full_name: form.full_name || null,
      email: form.email || null,
      phone: form.phone || null,
      location: form.location || null,
      service_type: form.service_type || null,
      price: form.price ? parseFloat(form.price) : null,
      serial_number: form.serial_number || null,
      supporter: form.supporter || null,
      has_bonus: form.has_bonus || false,
    };

    try {
      await axios.post(`${apiUrl}/api/clients`, payload);
      alert('Client saved!');
      // Optionally reset form here:
      setForm({
        full_name: '',
        email: '',
        phone: '',
        location: '',
        service_type: '',
        price: '',
        serial_number: '',
        supporter: '',
        has_bonus: false,
      });
    } catch (error) {
      console.error('❌ Error submitting form:', error.response?.data || error.message);
      alert('Error saving client. Check the console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="full_name"
        value={form.full_name}
        onChange={handleChange}
        placeholder="Full Name (Optional)"
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email (Optional)"
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone Number (Optional)"
      />
      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Location (Optional)"
      />

      <select
        name="service_type"
        value={form.service_type}
        onChange={handleChange}
      >
        <option value="">Select Service</option>
        <option value="Starlink Mini">Starlink Mini</option>
        <option value="Starlink Standard">Starlink Standard</option>
        <option value="4G SIM Card">4G SIM Card</option>
        <option value="GPS">GPS</option>
        <option value="Other">Other</option>
      </select>

      {(form.service_type === 'Starlink Mini' || form.service_type === 'Starlink Standard') && (
        <input
          name="serial_number"
          value={form.serial_number}
          onChange={handleChange}
          placeholder="Serial Number (Optional)"
        />
      )}

      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Price (Optional)"
        min="0"
        step="0.01"
      />
      <input
        name="supporter"
        value={form.supporter}
        onChange={handleChange}
        placeholder="Supporter (Optional)"
      />

      <label>
        <input
          type="checkbox"
          name="has_bonus"
          checked={form.has_bonus}
          onChange={handleChange}
        />
        Has Bonus?
      </label>

      <button type="submit">Save</button>
    </form>
  );
};

export default Create;
