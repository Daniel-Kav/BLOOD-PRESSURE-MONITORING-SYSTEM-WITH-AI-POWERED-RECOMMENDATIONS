import React, { useEffect, useMemo } from 'react';
import { useBPStore } from '../store/bpStore';
import BPChart from '../components/BPChart';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const Stats: React.FC = () => {
  const { readings, fetchReadings } = useBPStore();

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  const diagnosisStats = useMemo(() => {
    const stats: Record<string, number> = {};
    
    readings.forEach((reading) => {
      stats[reading.diagnosis] = (stats[reading.diagnosis] || 0) + 1;
    });
    
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [readings]);

  const averages = useMemo(() => {
    if (readings.length === 0) return { systolic: 0, diastolic: 0 };
    
    const sum = readings.reduce(
      (acc, reading) => ({
        systolic: acc.systolic + reading.systolic,
        diastolic: acc.diastolic + reading.diastolic,
      }),
      { systolic: 0, diastolic: 0 }
    );
    
    return {
      systolic: Math.round(sum.systolic / readings.length),
      diastolic: Math.round(sum.diastolic / readings.length),
    };
  }, [readings]);

  const COLORS = ['#10b981', '#fbbf24', '#f97316', '#ef4444', '#b91c1c'];

  const getDiagnosisColor = (diagnosis: string) => {
    switch (diagnosis) {
      case 'Normal':
        return COLORS[0];
      case 'Elevated':
        return COLORS[1];
      case 'Hypertension Stage 1':
        return COLORS[2];
      case 'Hypertension Stage 2':
        return COLORS[3];
      case 'Hypertensive Crisis':
        return COLORS[4];
      default:
        return '#9ca3af';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
        <p className="text-gray-600">Analyze your blood pressure trends and patterns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Summary</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Readings</p>
              <p className="text-2xl font-bold text-gray-900">{readings.length}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Average Blood Pressure</p>
              <p className="text-2xl font-bold text-gray-900">
                {averages.systolic}/{averages.diastolic} <span className="text-sm font-normal">mmHg</span>
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Latest Reading</p>
              {readings.length > 0 ? (
                <p className="text-2xl font-bold text-gray-900">
                  {readings[0].systolic}/{readings[0].diastolic}{' '}
                  <span className="text-sm font-normal">mmHg</span>
                </p>
              ) : (
                <p className="text-gray-500">No readings yet</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Diagnosis Distribution</h2>
          
          {readings.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diagnosisStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {diagnosisStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getDiagnosisColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} readings`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500">No data available</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <BPChart />
      </div>
    </div>
  );
};

export default Stats;