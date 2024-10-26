import React, { useState, useEffect } from 'react';
import axios from '../Api';
import { FileUploader } from "react-drag-drop-files";
import './EditEmployeeModal.css';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

function EditEmployeeModal({ employee, onClose, onUpdate, onDelete, fields }) {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const { token } = useSelector((state) => state.authReducer);

  useEffect(() => {
    const { id, ...dataWithoutId } = employee;
    setFormData(dataWithoutId);
  }, [employee]);

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
    const form = new FormData();

    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const response = await axios.put(`employees/${employee.id}/`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      await Swal.fire({
        title: 'Success!',
        text: 'Employee updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating employee:", error);
      setError("Failed to update employee. Please try again.");
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`employees/${employee.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await Swal.fire({
          title: 'Deleted!',
          text: 'Employee has been deleted.',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        onDelete(employee.id);
      } catch (error) {
        console.error("Error deleting employee:", error);
        setError("Failed to delete employee. Please try again.");
      }
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Edit Employee</h3>
        {error && <p className="error-message">{error}</p>}
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
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    placeholder={`Enter ${field.name}`}
                  />
                ) : field.type === 'BLOB' ? (
                  <>
                    <FileUploader
                      handleChange={(file) => handleFileUpload(file, field.name)}
                      name={field.name}
                      types={["jpg", "png", "txt", "pdf"]}
                    />
                    {formData[field.name] instanceof File ? (
                      <p>File selected: {formData[field.name]?.name}</p>
                    ) : (
                      <p>No file selected</p>
                    )}
                  </>
                ) : field.type === 'DATE' ? (
                  <input
                    type="date"
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                  />
                ) : field.type === 'BOOLEAN' ? (
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={formData[field.name] || false}
                    onChange={handleChange}
                  />
                ) : field.type.toUpperCase() === "VARCHAR(254)" ? (
                  <input
                    type="email"
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    placeholder={`Enter ${field.name}`}
                  />
                ) : (
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    placeholder={`Enter ${field.name}`}
                  />
                )}
              </div>
            ))}
          <div className="modal-actions">
            <button type="button" onClick={handleDelete} className="delete-button">
              Delete
            </button>
            <button type="submit" className="submit-button">
              Submit
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
