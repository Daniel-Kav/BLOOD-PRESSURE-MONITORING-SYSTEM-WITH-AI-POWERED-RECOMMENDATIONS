import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useBPStore } from '../store/bpStore';

const BPChart: React.FC = () => {
  const { readings } = useBPStore();

  const chartData = useMemo(() => {
    return readings
      .slice()
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((reading) => ({
        date: new Date(reading.created_at).toLocaleDateString(),
        systolic: reading.systolic,
        diastolic: reading.diastolic,
      }));
  }, [readings]);

  if (readings.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No blood pressure readings recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Blood Pressure Trends</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[40, 200]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="systolic"
              stroke="#ef4444"
              activeDot={{ r: 8 }}
              name="Systolic"
            />
            <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic" />
            {/* Reference lines for normal ranges */}
            <Line
              type="monotone"
              dataKey="systolicNormal"
              stroke="#10b981"
              strokeDasharray="5 5"
              dot={false}
              activeDot={false}
              name="Normal Systolic"
            />
            <Line
              type="monotone"
              dataKey="diastolicNormal"
              stroke="#10b981"
              strokeDasharray="5 5"
              dot={false}
              activeDot={false}
              name="Normal Diastolic"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BPChart;