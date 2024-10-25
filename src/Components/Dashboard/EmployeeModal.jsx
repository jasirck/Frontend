import React, { useState } from 'react';
import axios from '../Api'; // Import Axios
import { FileUploader } from "react-drag-drop-files";
import './EmployeeModal.css';

function EmployeeModal({ onClose, onSubmit, fields }) {
  const [formData, setFormData] = useState({});

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
    e.preventDefault(); // Prevent default form submission
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const response = await axios.post('employees/', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSubmit(response.data); // Pass the new employee data back to the parent
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Add New Employee</h3>
        <form className="employee-form" onSubmit={handleSubmit}>
          {fields
            .filter((field) => field.name !== 'id') // Exclude 'id' field if necessary
            .map((field) => (
              <div key={field.name} className="form-group">
                <label>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</label>
                {field.type === 'INTEGER' ? (
                  <input
                    type="number"
                    name={field.name}
                    onChange={handleChange}
                    placeholder={`Enter ${field.name}`}
                  />
                ) : field.type === 'BLOB' ? (
                  <FileUploader
                    handleChange={(file) => handleFileUpload(file, field.name)}
                    name={field.name}
                    types={["jpg", "png", "txt", "pdf"]} // Define acceptable file types here
                  />
                ) : field.type === 'DATE' ? (
                  <input
                    type="date"
                    name={field.name}
                    onChange={handleChange}
                  />
                ) : field.type === 'BOOLEAN' ? (
                  <input
                    type="checkbox"
                    name={field.name}
                    onChange={handleChange}
                  />
                ) : field.type === 'VARCHAR(255)' ? (
                  <input
                    type="email"
                    name={field.name}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type="text"
                    name={field.name}
                    onChange={handleChange}
                    placeholder={`Enter ${field.name}`}
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
