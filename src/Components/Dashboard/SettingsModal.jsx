import React, { useState } from 'react';
import './SettingsModal.css';
import axios from '../Api';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

function SettingsModal({ onClose, onAddField, currentFields, onEditField, onDeleteField }) {
  const [newField, setNewField] = useState('');
  const [dataType, setDataType] = useState('text');
  const [editingField, setEditingField] = useState('');
  const [editedFieldName, setEditedFieldName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { token } = useSelector((state) => state.authReducer);

  const handleAddField = async () => {
    setErrorMessage('');
    if (newField && !currentFields.some(field => field.name === newField)) {
      try {
        await axios.post('employees/add-field/', { field_name: newField, field_type: dataType }, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        onAddField({ name: newField, type: dataType });
        setNewField('');
        setDataType('text');

        await Swal.fire({
          title: 'Success!',
          text: `Field "${newField}" added successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } catch (error) {
        setErrorMessage("Error adding field: " + error.response.data?.detail || error.message);
      }
    } else {
      setErrorMessage('Field name is required or already exists.');
    }
  };

  const handleEditField = async (fieldName) => {
    setErrorMessage('');
    if (editedFieldName) {
      try {
        await axios.put('employees/edit-field/', { old_field_name: fieldName, new_field_name: editedFieldName }, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        onEditField(fieldName, editedFieldName);
        setEditingField('');
        setEditedFieldName('');

        await Swal.fire({
          title: 'Success!',
          text: `Field name updated from "${fieldName}" to "${editedFieldName}".`,
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } catch (error) {
        setErrorMessage("Error editing field: " + error.response.data?.detail || error.message);
      }
    } else {
      setErrorMessage('New field name is required.');
    }
  };

  const handleDeleteField = async (fieldName) => {
    setErrorMessage('');
    try {
      await axios.delete('employees/edit-field/', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { field_name: fieldName },
      });
      onDeleteField(fieldName);

      await Swal.fire({
        title: 'Deleted!',
        text: `Field "${fieldName}" has been deleted.`,
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      setErrorMessage("Error deleting field: " + error.response.data?.detail || error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Manage Fields</h3>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="form-section">
          <h4>Add New Field</h4>
          <input
            type="text"
            placeholder="Field name"
            value={newField}
            onChange={(e) => setNewField(e.target.value)}
            className="input-field"
          />
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            className="data-type-select"
          >
            <option value="char">Char</option>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="url">URL</option>
            <option value="checkbox">Checkbox</option>
            <option value="image">Image</option>
            <option value="file.txt">file.txt</option>
          </select>
          <button onClick={handleAddField} className="short-button add-field-button">Add Field</button>
        </div>

        <h4>Current Fields</h4>
        {currentFields.map((field) => (
          field.name !== 'id' && (
            <div key={field.name} className="edit-field-group">
              <span className="field-name">{field.name}</span>
              {editingField === field.name ? (
                <>
                  <input
                    type="text"
                    placeholder="New field name"
                    value={editedFieldName}
                    onChange={(e) => setEditedFieldName(e.target.value)}
                    className="input-field"
                  />
                  <button onClick={() => handleEditField(field.name)} className="short-button update-field-button">
                    Update
                  </button>
                  <button onClick={() => setEditingField('')} className="short-button cancel-edit-button">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="short-button edit-button"
                    onClick={() => { setEditingField(field.name); setEditedFieldName(''); }}
                  >
                    Edit
                  </button>
                  <button
                    className="short-button delete-button"
                    onClick={() => handleDeleteField(field.name)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )
        ))}
        
        <button className="short-button close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default SettingsModal;
