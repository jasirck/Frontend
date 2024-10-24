import React, { useState } from 'react';
import './Dashboard.css';
import EmployeeModal from './EmployeeModal';
// import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
//   const navigate = useNavigate();

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = (newEmployee) => {
    setEmployees([...employees, { id: employees.length + 1, ...newEmployee }]);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logged out');
    // navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h2>Employee Dashboard</h2>
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="create-button" onClick={() => setIsModalOpen(true)}>
            Create Employee
          </button>
        </div>
      </div>

      <div className="employee-table">
        {filteredEmployees.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No employees found.</p>
        )}
      </div>

      {isModalOpen && (
        <EmployeeModal onClose={() => setIsModalOpen(false)} onSubmit={handleAddEmployee} />
      )}
    </div>
  );
}

export default Dashboard;
