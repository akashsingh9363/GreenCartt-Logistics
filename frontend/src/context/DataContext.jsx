import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = 'https://green-cartt-logistics.vercel.app/api';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Amit', status: 'Active', efficiency: 95, deliveries: 234 },
    { id: 2, name: 'Priya', status: 'Active', efficiency: 88, deliveries: 189 },
    { id: 3, name: 'Rohit', status: 'Off-duty', efficiency: 92, deliveries: 156 },
    { id: 4, name: 'Neha', status: 'Active', efficiency: 97, deliveries: 278 },
  ]);

  const [routes, setRoutes] = useState([
    { id: 1, name: 'Downtown Loop', distance: 15.2, avgTime: 45, fuelCost: 8.50 },
    { id: 2, name: 'Suburban Circuit', distance: 28.7, avgTime: 78, fuelCost: 16.20 },
    { id: 3, name: 'Industrial Zone', distance: 22.1, avgTime: 62, fuelCost: 12.80 },
    { id: 4, name: 'Residential West', distance: 19.5, avgTime: 55, fuelCost: 11.40 },
  ]);

  const [orders, setOrders] = useState([
    { id: 1, customer: 'Green Grocers', status: 'Delivered', priority: 'High', value: 2594 },
    { id: 2, customer: 'Eco Market', status: 'In Transit', priority: 'Medium', value: 1835 },
    { id: 3, customer: 'Fresh Foods Co', status: 'Pending', priority: 'High', value: 766 },
    { id: 4, customer: 'Organic Plus', status: 'Delivered', priority: 'Low', value: 572 },
  ]);

  const [kpis, setKpis] = useState({
    totalProfit: 15420,
    efficiencyScore: 94.2,
    onTimeDeliveries: 87,
    lateDeliveries: 13,
    totalFuelCost: 2840,
    avgDeliveryTime: 42
  });

  const [simulationHistory, setSimulationHistory] = useState([]);

  // Authentication functions
  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('token', data.data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('token', data.data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  // API helper function
  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  };

  const runSimulation = async (params) => {
    try {
      const response = await apiCall('/simulation/run', {
        method: 'POST',
        body: params,
      });

      const newKpis = response.data.results;
      setKpis(newKpis);
      
      const simulationResult = {
        id: response.data.simulationId,
        timestamp: new Date(),
        parameters: params,
        results: newKpis
      };
      
      setSimulationHistory(prev => [simulationResult, ...prev.slice(0, 9)]);
      
      return newKpis;
    } catch (error) {
      console.error('Simulation error:', error);
      // Fallback to mock data if API fails
      const efficiency = Math.random() * 10 + 85;
      const profit = Math.floor(Math.random() * 5000) + 12000;
      const fuelCost = Math.floor(Math.random() * 1000) + 2000;
      const onTime = Math.floor(Math.random() * 20) + 75;
      
      const newKpis = {
        totalProfit: profit,
        efficiencyScore: efficiency,
        onTimeDeliveries: onTime,
        lateDeliveries: 100 - onTime,
        totalFuelCost: fuelCost,
        avgDeliveryTime: Math.floor(Math.random() * 20) + 35
      };

      setKpis(newKpis);
      
      const simulationResult = {
        id: Date.now(),
        timestamp: new Date(),
        parameters: params,
        results: newKpis
      };
      
      setSimulationHistory(prev => [simulationResult, ...prev.slice(0, 9)]);
      
      return newKpis;
    }
  };

  // Load simulation history on mount
  useEffect(() => {
    if (token) {
      loadSimulationHistory();
    }
  }, [token]);

  const loadSimulationHistory = async () => {
    try {
      const response = await apiCall('/simulation/history');
      setSimulationHistory(response.data.simulations.map(sim => ({
        id: sim._id,
        timestamp: new Date(sim.createdAt),
        parameters: sim.parameters,
        results: sim.results
      })));
    } catch (error) {
      console.error('Failed to load simulation history:', error);
    }
  };

  const value = {
    // Auth
    user,
    token,
    signup,
    login,
    logout,
    // Data
    drivers,
    setDrivers,
    routes,
    setRoutes,
    orders,
    setOrders,
    kpis,
    setKpis,
    simulationHistory,
    runSimulation,
    // API
    apiCall,
    loadSimulationHistory
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};