import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KPICard = ({ title, value, change, icon: Icon, color, trend, delay = 0 }) => {
  const colorClasses = {
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const trendBg = trend === 'up' ? 'bg-green-50' : 'bg-red-50';

  return (
    <div 
      className="glass-card p-6 hover:scale-105 transition-transform duration-300"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendBg} ${trendColor}`}>
            <TrendIcon size={12} />
            {change}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      
      {/* Animated progress bar */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(parseFloat(value.replace(/[^0-9.]/g, '')) || 0, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default KPICard;