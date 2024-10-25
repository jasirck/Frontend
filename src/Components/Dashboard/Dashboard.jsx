import React, { useEffect, useState } from 'react';
import axios from '../Api'; // Import Axios
import './Dashboard.css';
import EmployeeModal from './EmployeeModal';
import EditEmployeeModal from './EditEmployeeModal'; // Import the EditEmployeeModal
import SettingsModal from './SettingsModal';
import { useNavigate } from 'react-router-dom';
import { logout } from '../toolkit/Slice';
import { useDispatch, useSelector } from 'react-redux';

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [fields, setFields] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // New state for edit modal
  const [editingEmployee, setEditingEmployee] = useState(null); // State to hold the employee being edited
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchEmployees = async () => {
      try {
        const response = await axios.get('employees/');
        setEmployees(response.data.data);
        const columnNames = response.data.columns;
        const columnTypes = response.data.column_types;
        const newFields = columnNames.map((name, index) => ({
          name,
          type: columnTypes[index],
        }));
        setFields(newFields);
        console.log(response);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployees();
  }, [token, navigate, isModalOpen, isEditModalOpen, isSettingsModalOpen]);

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee); // Set the employee to edit
    setIsEditModalOpen(true); // Open the edit modal
  };
  
  const handleDeleteField = (fieldName) => {
    setFields(prevFields => prevFields.filter(field => field.name !== fieldName));
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
    );
  };

  const handleEditField = (oldFieldName, newFieldName) => {
    setFields(prevFields =>
      prevFields.map(field => 
        field.name === oldFieldName ? { ...field, name: newFieldName } : field
      )
    );
  };

  // Function to search employees based on the search term
  const handleSearch = async (term) => {
    if (term.trim() === '') {
      const response = await axios.get('employees/');
      setEmployees(response.data.data);
      return;
    }

    try {
      const response = await axios.get(`employees/search/?search=${term}`);
      setEmployees(response.data.data);
    } catch (error) {
      console.error("Error searching employees:", error);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  const handleAddEmployee = (newEmployee) => {
    setEmployees([...employees, newEmployee]);
    setIsModalOpen(false);
  };

  const handleAddField = (newField) => {
    setFields([...fields, newField]);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>Hello, {user}!</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="employee-header">
        <div className="actions">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button className="create-button" onClick={() => setIsModalOpen(true)}>
            Create Employee
          </button>
          <button className="settings-button" onClick={() => setIsSettingsModalOpen(true)}>
            Settings
          </button>
        </div>
      </div>

      <div className="employee-table">
        <table>
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field.name}>{field.name}</th> // Correct usage here
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee.id}>
                  {fields.map((field) => (
                    <td key={field.name}>
                      {field.type === 'image' && employee[field.name] ? (
                        <img
                          src={'http://127.0.0.1:8000' + employee[field.name]}
                          alt={field.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      ) : (
                        employee[field.name] || ''
                      )}
                    </td>
                  ))}
                  <td>
                    <button className="edit-button" onClick={() => handleEditEmployee(employee)}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={fields.length + 1} style={{ textAlign: 'center' }}>
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <EmployeeModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddEmployee}
          fields={fields}
        />
      )}
      {isEditModalOpen && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateEmployee} // Pass the update function
          fields={fields}
        />
      )}
      {isSettingsModalOpen && (
        <SettingsModal
          currentFields={fields}
          onClose={() => setIsSettingsModalOpen(false)} // Logic to close modal
          onAddField={handleAddField} // Pass the add field function
          onEditField={handleEditField} // Pass the edit field function
          onDeleteField={handleDeleteField} // Ensure this prop is passed
        />  
      )}
    </div>
  );
}

export default Dashboard;
