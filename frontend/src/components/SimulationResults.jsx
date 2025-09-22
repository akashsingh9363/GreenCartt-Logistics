import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Clock, Truck, Gauge } from 'lucide-react';

const SimulationResults = ({ results }) => {
  const metrics = [
    {
      label: 'Total Profit',
      value: `$${results.totalProfit.toLocaleString()}`,
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Efficiency Score',
      value: `${results.efficiencyScore.toFixed(1)}%`,
      icon: Gauge,
      color: 'blue'
    },
    {
      label: 'On-time Deliveries',
      value: `${results.onTimeDeliveries}%`,
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'Avg Delivery Time',
      value: `${results.avgDeliveryTime} min`,
      icon: Clock,
      color: 'purple'
    },
    {
      label: 'Total Fuel Cost',
      value: `$${results.totalFuelCost.toLocaleString()}`,
      icon: Truck,
      color: 'orange'
    },
    {
      label: 'Late Deliveries',
      value: `${results.lateDeliveries}%`,
      icon: TrendingDown,
      color: 'red'
    }
  ];

  const getColorClasses = (color) => {
    const classes = {
      green: 'text-green-600 bg-green-50',
      blue: 'text-blue-600 bg-blue-50',
      purple: 'text-purple-600 bg-purple-50',
      orange: 'text-orange-600 bg-orange-50',
      red: 'text-red-600 bg-red-50'
    };
    return classes[color] || classes.blue;
  };

  return (
    <div className="space-y-4 fade-in">
      <div className="grid grid-2 gap-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div 
              key={metric.label} 
              className="p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200 slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                  <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(metric.color)}`}>
                  <Icon size={16} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Summary */}
      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border border-green-100">
        <h3 className="font-semibold text-gray-900 mb-2">Performance Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Overall Performance:</span>
            <span className={`font-medium ${results.efficiencyScore > 90 ? 'text-green-600' : results.efficiencyScore > 80 ? 'text-yellow-600' : 'text-red-600'}`}>
              {results.efficiencyScore > 90 ? 'Excellent' : results.efficiencyScore > 80 ? 'Good' : 'Needs Improvement'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Profitability:</span>
            <span className="font-medium text-green-600">
              ${(results.totalProfit - results.totalFuelCost).toLocaleString()} Net
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationResults;