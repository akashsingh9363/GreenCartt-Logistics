import React from 'react';
import { Truck, Package, Route, User, Clock } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'delivery',
      icon: Package,
      title: 'Order #1234 delivered successfully',
      description: 'Delivered to Green Grocers by Alex Johnson',
      timestamp: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'driver',
      icon: User,
      title: 'Sarah Chen started shift',
      description: 'Assigned to Downtown Loop route',
      timestamp: '15 minutes ago',
      status: 'info'
    },
    {
      id: 3,
      type: 'route',
      icon: Route,
      title: 'Route optimization completed',
      description: 'Suburban Circuit route updated for efficiency',
      timestamp: '1 hour ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'delay',
      icon: Clock,
      title: 'Delivery delay reported',
      description: 'Order #1235 delayed due to traffic',
      timestamp: '2 hours ago',
      status: 'warning'
    },
    {
      id: 5,
      type: 'vehicle',
      icon: Truck,
      title: 'Vehicle maintenance scheduled',
      description: 'Truck #003 scheduled for routine maintenance',
      timestamp: '3 hours ago',
      status: 'info'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activity.icon;
        return (
          <div 
            key={activity.id} 
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(activity.status)}`}>
              <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 mb-1">{activity.title}</p>
              <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
              <p className="text-xs text-gray-500">{activity.timestamp}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentActivity;