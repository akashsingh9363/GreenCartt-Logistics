import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import KPICard from '../components/KPICard';
import DeliveryChart from '../components/DeliveryChart';
import FuelCostChart from '../components/FuelCostChart';
import RecentActivity from '../components/RecentActivity';
import { TrendingUp, Clock, DollarSign, Truck } from 'lucide-react';

const Dashboard = () => {
  const { kpis, drivers, orders } = useData();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const kpiData = [
    {
      title: 'Total Profit',
      value: `$${kpis.totalProfit.toLocaleString()}`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'green',
      trend: 'up'
    },
    {
      title: 'Efficiency Score',
      value: `${kpis.efficiencyScore.toFixed(1)}%`,
      change: '+3.2%',
      icon: TrendingUp,
      color: 'blue',
      trend: 'up'
    },
    {
      title: 'Avg Delivery Time',
      value: `${kpis.avgDeliveryTime} min`,
      change: '-5.8%',
      icon: Clock,
      color: 'purple',
      trend: 'down'
    },
    {
      title: 'Active Drivers',
      value: drivers.filter(d => d.status === 'Active').length.toString(),
      change: '+2',
      icon: Truck,
      color: 'orange',
      trend: 'up'
    }
  ];

  return (
    <div className={`space-y-6 ${isVisible ? 'fade-in' : ''}`}>
      {/* Header */}
      <div className="slide-up">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">
          Monitor your delivery operations and key performance indicators
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-4 bounce-in" style={{ animationDelay: '0.2s' }}>
        {kpiData.map((kpi, index) => (
          <KPICard 
            key={kpi.title} 
            {...kpi} 
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-2 gap-6">
        <div className="slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Delivery Performance
            </h2>
            <DeliveryChart />
          </div>
        </div>

        <div className="slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Fuel Cost Breakdown
            </h2>
            <FuelCostChart />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="slide-up" style={{ animationDelay: '0.6s' }}>
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            Recent Activity
          </h2>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;