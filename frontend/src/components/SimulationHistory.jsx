import React from 'react';
import { Calendar, TrendingUp, DollarSign } from 'lucide-react';

const SimulationHistory = ({ history }) => {
  return (
    <div className="space-y-3">
      {history.slice(0, 5).map((simulation, index) => (
        <div 
          key={simulation.id} 
          className="p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200 slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">
                {simulation.timestamp.toLocaleDateString()} at {simulation.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              simulation.results.efficiencyScore > 90 
                ? 'bg-green-100 text-green-600'
                : simulation.results.efficiencyScore > 80
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-red-100 text-red-600'
            }`}>
              {simulation.results.efficiencyScore.toFixed(1)}% Efficiency
            </span>
          </div>
          
          <div className="grid grid-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-green-500" />
              <span className="text-gray-600">Profit:</span>
              <span className="font-medium">${simulation.results.totalProfit.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-blue-500" />
              <span className="text-gray-600">On-time:</span>
              <span className="font-medium">{simulation.results.onTimeDeliveries}%</span>
            </div>
            <div className="text-gray-600">
              <span>Drivers:</span> <span className="font-medium">{simulation.parameters.drivers}</span>
            </div>
          </div>
        </div>
      ))}
      
      {history.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No simulation history available</p>
          <p className="text-sm">Run your first simulation to see results here</p>
        </div>
      )}
    </div>
  );
};

export default SimulationHistory;