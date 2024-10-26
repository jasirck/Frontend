import React, { useState } from 'react';
import axios from '../Api';
import { FileUploader } from "react-drag-drop-files";
import './EmployeeModal.css';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

function EmployeeModal({ onClose, onSubmit, fields }) {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const { token } = useSelector((state) => state.authReducer);

  const handleChange = (e) => {
    const { name, type, files, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value,
    });
  };

  const handleFileUpload = (file, name) => {
    setFormData({
      ...formData,
      [name]: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        setErrorMessage(`Please fill in the ${field.name} field.`);
        return;
      }
    }

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const response = await axios.post('employees/', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      onSubmit(response.data);

      await Swal.fire({
        title: 'Success!',
        text: 'Employee created successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      onClose();
    } catch (error) {
      setErrorMessage("Error creating employee: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Add New Employee</h3>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form className="employee-form" onSubmit={handleSubmit}>
          {fields
            .filter((field) => field.name !== 'id')
            .map((field) => (
              <div key={field.name} className="form-group">
                <label>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</label>
                {field.type === 'INTEGER' ? (
                  <input
                    type="number"
                    name={field.name}
                    onChange={handleChange}
                    placeholder={`Enter ${field.name}`}
                    required={field.required}
                  />
                ) : field.type === 'BLOB' ? (
                  <FileUploader
                    handleChange={(file) => handleFileUpload(file, field.name)}
                    name={field.name}
                    types={["jpg", "png", "txt", "pdf"]}
                    required={field.required}
                  />
                ) : field.type === 'DATE' ? (
                  <input
                    type="date"
                    name={field.name}
                    onChange={handleChange}
                    required={field.required}
                  />
                ) : field.type === 'BOOLEAN' ? (
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={formData[field.name] || false}
                    onChange={handleChange}
                  />
                ) : field.type === 'VARCHAR(255)' ? (
                  <input
                    type="email"
                    name={field.name}
                    onChange={handleChange}
                    required={field.required}
                  />
                ) : (
                  <input
                    type="text"
                    name={field.name}
                    onChange={handleChange}
                    placeholder={`Enter ${field.name}`}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeModal;
