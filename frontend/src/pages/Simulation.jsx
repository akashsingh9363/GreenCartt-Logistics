import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import SimulationForm from '../components/SimulationForm';
import SimulationResults from '../components/SimulationResults';
import SimulationHistory from '../components/SimulationHistory';
import { Play, RotateCcw, TrendingUp , Truck  } from 'lucide-react';

const Simulation = () => {
  const { runSimulation, simulationHistory, kpis } = useData();
  const [isRunning, setIsRunning] = useState(false);
  const [currentResults, setCurrentResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // const handleRunSimulation = async (params) => {
  //   setIsRunning(true);
  //   setShowResults(false);
    
  //   // Simulate processing time
  //   await new Promise(resolve => setTimeout(resolve, 2000));
    
  //   const results = runSimulation(params);
  //   setCurrentResults(results);
  //   setIsRunning(false);
  //   setShowResults(true);
  // };
    const handleRunSimulation = async (params) => {
    setIsRunning(true);
    setShowResults(false);
    setCurrentResults(null);

    try {
      // simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // WAIT for results
      const results = await runSimulation(params);

      setCurrentResults(results);
      setShowResults(true);
    } catch (error) {
      console.error("Simulation failed:", error);
      setCurrentResults({ error: error.message || "Simulation failed" });
      setShowResults(true);
    } finally {
      setIsRunning(false);
    }
  };


  const handleReset = () => {
    setCurrentResults(null);
    setShowResults(false);
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="slide-up">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Delivery Simulation
        </h1>
        <p className="text-gray-600">
          Experiment with different parameters to optimize your delivery operations
        </p>
      </div>

      {/* Simulation Controls */}
      <div className="grid grid-2 gap-6">
        {/* Simulation Form */}
        <div className="slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Play size={20} className="text-green-500" />
                Simulation Parameters
              </h2>
              {showResults && (
                <button
                  onClick={handleReset}
                  className="btn btn-secondary"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              )}
            </div>
            <SimulationForm onSubmit={handleRunSimulation} isRunning={isRunning} />
          </div>
        </div>

        {/* Results */}
        <div className="slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Simulation Results
            </h2>
            
            {isRunning && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative mb-4">
                  <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-spin border-t-green-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <p className="text-gray-600 font-medium">Running simulation...</p>
                <p className="text-sm text-gray-500">This may take a few moments</p>
              </div>
            )}

            {showResults && currentResults && (
              <SimulationResults results={currentResults} />
            )}

            {!isRunning && !showResults && (
              <div className="text-center py-12 text-gray-500">
                <Play size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-medium">Ready to simulate</p>
                <p className="text-sm">Configure parameters and run simulation</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulation History */}
      {simulationHistory.length > 0 && (
        <div className="slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Simulation History</h2>
            <SimulationHistory history={simulationHistory} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulation;