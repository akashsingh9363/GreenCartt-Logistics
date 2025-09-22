import React, { useState } from 'react';
import { Play, Settings } from 'lucide-react';

const SimulationForm = ({ onSubmit, isRunning }) => {
  const [params, setParams] = useState({
    drivers: 4,
    startTime: '08:00',
    maxHours: 8,
    routeOptimization: true,
    fuelEfficiency: 85,
    weatherCondition: 'normal'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isRunning) {
      onSubmit(params);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-2 gap-4">
        <div className="form-group">
          <label htmlFor="drivers" className="form-label">Number of Drivers</label>
          <input
            type="number"
            id="drivers"
            name="drivers"
            value={params.drivers}
            onChange={handleChange}
            min="1"
            max="10"
            className="form-input"
            disabled={isRunning}
          />
        </div>

        <div className="form-group">
          <label htmlFor="startTime" className="form-label">Start Time</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={params.startTime}
            onChange={handleChange}
            className="form-input"
            disabled={isRunning}
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxHours" className="form-label">Max Hours per Day</label>
          <input
            type="number"
            id="maxHours"
            name="maxHours"
            value={params.maxHours}
            onChange={handleChange}
            min="4"
            max="12"
            className="form-input"
            disabled={isRunning}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fuelEfficiency" className="form-label">Fuel Efficiency %</label>
          <input
            type="range"
            id="fuelEfficiency"
            name="fuelEfficiency"
            value={params.fuelEfficiency}
            onChange={handleChange}
            min="70"
            max="100"
            className="w-full"
            disabled={isRunning}
          />
          <div className="text-sm text-gray-600 mt-1">{params.fuelEfficiency}%</div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="weatherCondition" className="form-label">Weather Condition</label>
        <select
          id="weatherCondition"
          name="weatherCondition"
          value={params.weatherCondition}
          onChange={handleChange}
          className="form-input"
          disabled={isRunning}
        >
          <option value="excellent">Excellent</option>
          <option value="normal">Normal</option>
          <option value="poor">Poor</option>
          <option value="severe">Severe</option>
        </select>
      </div>

      <div className="form-group">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="routeOptimization"
            checked={params.routeOptimization}
            onChange={handleChange}
            className="rounded"
            disabled={isRunning}
          />
          <span className="form-label mb-0">Enable Route Optimization</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isRunning}
        className={`btn btn-primary w-full ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isRunning ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Running Simulation...
          </>
        ) : (
          <>
            <Play size={16} />
            Run Simulation
          </>
        )}
      </button>
    </form>
  );
};

export default SimulationForm;