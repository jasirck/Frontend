import React, { useState, useEffect } from 'react';
import axios from '../Api'; // Import Axios
import './EditEmployeeModal.css';
import { FileUploader } from "react-drag-drop-files";

function EditEmployeeModal({ employee, onClose, fields, onUpdate }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Exclude id from form data
    const { id, ...dataWithoutId } = employee;
    setFormData(dataWithoutId);
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if there are no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Call API to update employee
        await axios.put(`employees/${employee.id}/`, { ...formData, id: employee.id });
        onUpdate({ ...formData, id: employee.id }); // Update the employee in the parent component
        onClose(); // Close the modal
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    }
  };

  const handleFileUpload = (file, fieldName) => {
    // Handle the file upload logic here
    setFormData((prev) => ({ ...prev, [fieldName]: file }));
  };

  const handleDeleteEmployee = async () => {
    try {
      // Make a DELETE request to the API to remove the employee by ID
      await axios.delete(`employees/${employee.id}/`);
      onClose(); // Close the modal upon successful deletion
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Employee</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            field.name !== 'id' && ( // Exclude id field from rendering
              <div className="form-group" key={field.name}>
                <label htmlFor={field.name}>
                  {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </label>
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
                {errors[field.name] && <p className="error-message">{errors[field.name]}</p>}
              </div>
            )
          ))}
          <div className="modal-buttons">
            <button type="submit" className="save-button">Save</button>
            <button type="button" className="delete-button" onClick={handleDeleteEmployee}>
              Delete
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEmployeeModal;
