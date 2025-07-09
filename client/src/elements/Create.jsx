// src/pages/Create.js
import React, { useState } from 'react';
import axios from 'axios';

const Create = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    starlink_type: '',
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
    try {
      await axios.post(${apiUrl}/api/clients, form);
      alert('Client saved!');
    } catch (error) {
      console.error('❌ Error submitting form:', error.response?.data || error.message);
      alert('Error saving client. Check the console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="full_name" onChange={handleChange} placeholder="Full Name" />
      <input name="email" type="email" onChange={handleChange} placeholder="Email" />
      <input name="phone" onChange={handleChange} placeholder="Phone Number" />
      <input name="location" onChange={handleChange} placeholder="Location" />
      <select name="starlink_type" onChange={handleChange}>
        <option value="">Select Starlink Type</option>
        <option value="Starlink Mini">Starlink Mini</option>
        <option value="Starlink Standard">Starlink Standard</option>
        <option value="Other">Other</option>
      </select>
      {(form.starlink_type === 'Starlink Mini' || form.starlink_type === 'Starlink Standard') && (
        <input name="serial_number" onChange={handleChange} placeholder="Serial Number" />
      )}
      <input name="price" type="number" onChange={handleChange} placeholder="Price" />
      <input name="supporter" onChange={handleChange} placeholder="Supporter" />
      <label>
        <input type="checkbox" name="has_bonus" onChange={handleChange} />
        Has Bonus?
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

export default Create;