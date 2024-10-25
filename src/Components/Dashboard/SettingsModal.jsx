import React, { useState } from 'react';
import './SettingsModal.css';
import axios from '../Api';

function SettingsModal({ onClose, onAddField, currentFields, onEditField, onDeleteField }) {
  const [newField, setNewField] = useState('');
  const [dataType, setDataType] = useState('text');
  const [editingField, setEditingField] = useState('');
  const [editedFieldName, setEditedFieldName] = useState('');

  const handleAddField = async () => {
    if (newField && !currentFields.some(field => field.name === newField)) {
      try {
        await axios.post('employees/add-field/', { field_name: newField, field_type: dataType });
        onAddField({ name: newField, type: dataType });
        setNewField('');
        setDataType('text');
      } catch (error) {
        console.error("Error adding field:", error);
      }
    }
  };

  const handleEditField = async (fieldName) => {
    if (editedFieldName) {
      try {
        await axios.put('employees/edit-field/', { old_field_name: fieldName, new_field_name: editedFieldName });
        onEditField(fieldName, editedFieldName);
        setEditingField('');
        setEditedFieldName('');
      } catch (error) {
        console.error("Error editing field:", error);
      }
    }
  };

  const handleDeleteField = async (fieldName) => {
    try {
      await axios.delete('employees/edit-field/', { data: { field_name: fieldName } });
      onDeleteField(fieldName);
    } catch (error) {
      console.error("Error deleting field:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Manage Fields</h3>

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
          <button onClick={handleAddField} className="add-field-button">Add Field</button>
        </div>

        <h4>Current Fields</h4>
        {currentFields.map((field) => (
          field.name !== 'id' && ( // Exclude id field from rendering edit options
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
                  <button onClick={() => handleEditField(field.name)} className="update-field-button">
                    Update
                  </button>
                  <button onClick={() => setEditingField('')} className="cancel-edit-button">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="edit-button"
                    onClick={() => { setEditingField(field.name); setEditedFieldName(''); }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteField(field.name)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )
        ))}
        
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default SettingsModal;
