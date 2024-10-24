import React, { useState } from 'react';
import './EmployeeModal.css';

function EmployeeModal({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && phone) {
      onSubmit({ name, email, phone });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Add New Employee</h3>
        <form onSubmit={handleSubmit} className="employee-form">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter employee name"
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter employee email"
          />

          <label>Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Enter employee phone number"
          />

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeModal;
