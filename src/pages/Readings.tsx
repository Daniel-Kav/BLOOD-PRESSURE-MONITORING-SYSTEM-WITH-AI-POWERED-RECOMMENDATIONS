import React, { useEffect } from 'react';
import BPReadingsTable from '../components/BPReadingsTable';
import { useBPStore } from '../store/bpStore';

const Readings: React.FC = () => {
  const { fetchReadings } = useBPStore();

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blood Pressure History</h1>
        <p className="text-gray-600">View and manage all your blood pressure readings</p>
      </div>

      <BPReadingsTable />
    </div>
  );
};

export default Readings;