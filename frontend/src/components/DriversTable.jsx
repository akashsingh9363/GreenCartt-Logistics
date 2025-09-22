import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Edit, Trash2, Plus, User, TrendingUp } from 'lucide-react';

const DriversTable = () => {
  const { drivers, setDrivers } = useData();
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    status: 'Active',
    efficiency: 85,
    deliveries: 0
  });

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = (id, updatedDriver) => {
    setDrivers(drivers.map(driver => 
      driver.id === id ? { ...driver, ...updatedDriver } : driver
    ));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this driver?')) {
      setDrivers(drivers.filter(driver => driver.id !== id));
    }
  };

  const handleAddDriver = (e) => {
    e.preventDefault();
    const id = Math.max(...drivers.map(d => d.id)) + 1;
    setDrivers([...drivers, { id, ...newDriver }]);
    setNewDriver({ name: '', status: 'Active', efficiency: 85, deliveries: 0 });
    setShowAddForm(false);
  };

  const getStatusBadge = (status) => {
    const classes = {
      'Active': 'bg-green-100 text-green-800',
      'Off-duty': 'bg-gray-100 text-gray-800',
      'On-break': 'bg-yellow-100 text-yellow-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${classes[status] || classes['Off-duty']}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User size={20} className="text-blue-500" />
          Drivers Management
        </h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add Driver
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card p-4 slide-up">
          <form onSubmit={handleAddDriver} className="grid grid-2 gap-4">
            <input
              type="text"
              placeholder="Driver Name"
              value={newDriver.name}
              onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
              className="form-input"
              required
            />
            <select
              value={newDriver.status}
              onChange={(e) => setNewDriver({...newDriver, status: e.target.value})}
              className="form-input"
            >
              <option value="Active">Active</option>
              <option value="Off-duty">Off-duty</option>
              <option value="On-break">On-break</option>
            </select>
            <input
              type="number"
              placeholder="Efficiency %"
              value={newDriver.efficiency}
              onChange={(e) => setNewDriver({...newDriver, efficiency: parseInt(e.target.value)})}
              className="form-input"
              min="0"
              max="100"
            />
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">Add</button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">Name</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Efficiency</th>
              <th className="text-left py-3 px-4 font-semibold">Deliveries</th>
              <th className="text-left py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, index) => (
              <tr 
                key={driver.id} 
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <td className="py-3 px-4 font-medium">{driver.name}</td>
                <td className="py-3 px-4">
                  <span className={getStatusBadge(driver.status)}>
                    {driver.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-500" />
                    {driver.efficiency}%
                  </div>
                </td>
                <td className="py-3 px-4">{driver.deliveries}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(driver.id)}
                      className="p-1 rounded hover:bg-blue-100 text-blue-600"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(driver.id)}
                      className="p-1 rounded hover:bg-red-100 text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriversTable;