import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Edit, Trash2, Plus, Package, DollarSign } from 'lucide-react';

const OrdersTable = () => {
  const { orders, setOrders } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: '',
    status: 'Pending',
    priority: 'Medium',
    value: 0
  });

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== id));
    }
  };

  const handleAddOrder = (e) => {
    e.preventDefault();
    const id = Math.max(...orders.map(o => o.id)) + 1;
    setOrders([...orders, { id, ...newOrder }]);
    setNewOrder({ customer: '', status: 'Pending', priority: 'Medium', value: 0 });
    setShowAddForm(false);
  };

  const getStatusBadge = (status) => {
    const classes = {
      'Delivered': 'bg-green-100 text-green-800',
      'In Transit': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${classes[status] || classes['Pending']}`;
  };

  const getPriorityBadge = (priority) => {
    const classes = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-gray-100 text-gray-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${classes[priority] || classes['Medium']}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Package size={20} className="text-orange-500" />
          Orders Management
        </h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add Order
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card p-4 slide-up">
          <form onSubmit={handleAddOrder} className="grid grid-2 gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={newOrder.customer}
              onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
              className="form-input"
              required
            />
            <select
              value={newOrder.status}
              onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}
              className="form-input"
            >
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              value={newOrder.priority}
              onChange={(e) => setNewOrder({...newOrder, priority: e.target.value})}
              className="form-input"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              type="number"
              placeholder="Order Value ($)"
              value={newOrder.value}
              onChange={(e) => setNewOrder({...newOrder, value: parseInt(e.target.value)})}
              className="form-input"
              min="0"
              required
            />
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="btn btn-primary">Add Order</button>
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
              <th className="text-left py-3 px-4 font-semibold">Customer</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Priority</th>
              <th className="text-left py-3 px-4 font-semibold">Value</th>
              <th className="text-left py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr 
                key={order.id} 
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <td className="py-3 px-4 font-medium">{order.customer}</td>
                <td className="py-3 px-4">
                  <span className={getStatusBadge(order.status)}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={getPriorityBadge(order.priority)}>
                    {order.priority}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-green-500" />
                    ${order.value}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button className="p-1 rounded hover:bg-blue-100 text-blue-600">
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
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

export default OrdersTable;