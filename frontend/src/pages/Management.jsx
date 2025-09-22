import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import DriversTable from '../components/DriversTable';
import RoutesTable from '../components/RoutesTable';
import OrdersTable from '../components/OrdersTable';
import { Users, Route, Package, Plus } from 'lucide-react';

const Management = () => {
  const [activeTab, setActiveTab] = useState('drivers');
  const { drivers, routes, orders } = useData();

  const tabs = [
    { id: 'drivers', label: 'Drivers', icon: Users, count: drivers.length },
    { id: 'routes', label: 'Routes', icon: Route, count: routes.length },
    { id: 'orders', label: 'Orders', icon: Package, count: orders.length },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'drivers':
        return <DriversTable />;
      case 'routes':
        return <RoutesTable />;
      case 'orders':
        return <OrdersTable />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="slide-up flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Management Console
          </h1>
          <p className="text-gray-600">
            Manage drivers, routes, and orders for your delivery operations
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} />
          Add New
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass-card p-1">
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 justify-center
                    ${activeTab === tab.id
                      ? 'bg-white shadow-sm text-green-600 border border-green-100'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${activeTab === tab.id
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="glass-card p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Management;