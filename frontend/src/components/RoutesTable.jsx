import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Edit, Trash2, Plus, Route, Clock, DollarSign } from 'lucide-react';

const RoutesTable = () => {
  const { routes, setRoutes } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoute, setNewRoute] = useState({
    name: '',
    distance: 0,
    avgTime: 0,
    fuelCost: 0
  });

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this route?')) {
      setRoutes(routes.filter(route => route.id !== id));
    }
  };

  const handleAddRoute = (e) => {
    e.preventDefault();
    const id = Math.max(...routes.map(r => r.id)) + 1;
    setRoutes([...routes, { id, ...newRoute }]);
    setNewRoute({ name: '', distance: 0, avgTime: 0, fuelCost: 0 });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Route size={20} className="text-purple-500" />
          Routes Management
        </h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add Route
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card p-4 slide-up">
          <form onSubmit={handleAddRoute} className="grid grid-2 gap-4">
            <input
              type="text"
              placeholder="Route Name"
              value={newRoute.name}
              onChange={(e) => setNewRoute({...newRoute, name: e.target.value})}
              className="form-input"
              required
            />
            <input
              type="number"
              step="0.1"
              placeholder="Distance (miles)"
              value={newRoute.distance}
              onChange={(e) => setNewRoute({...newRoute, distance: parseFloat(e.target.value)})}
              className="form-input"
              required
            />
            <input
              type="number"
              placeholder="Average Time (minutes)"
              value={newRoute.avgTime}
              onChange={(e) => setNewRoute({...newRoute, avgTime: parseInt(e.target.value)})}
              className="form-input"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Fuel Cost ($)"
              value={newRoute.fuelCost}
              onChange={(e) => setNewRoute({...newRoute, fuelCost: parseFloat(e.target.value)})}
              className="form-input"
              required
            />
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="btn btn-primary">Add Route</button>
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
              <th className="text-left py-3 px-4 font-semibold">Route Name</th>
              <th className="text-left py-3 px-4 font-semibold">Distance</th>
              <th className="text-left py-3 px-4 font-semibold">Avg Time</th>
              <th className="text-left py-3 px-4 font-semibold">Fuel Cost</th>
              <th className="text-left py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route, index) => (
              <tr 
                key={route.id} 
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <td className="py-3 px-4 font-medium">{route.name}</td>
                <td className="py-3 px-4">{route.distance} mi</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-blue-500" />
                    {route.avgTime} min
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-green-500" />
                    ${route.fuelCost}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button className="p-1 rounded hover:bg-blue-100 text-blue-600">
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(route.id)}
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

export default RoutesTable;