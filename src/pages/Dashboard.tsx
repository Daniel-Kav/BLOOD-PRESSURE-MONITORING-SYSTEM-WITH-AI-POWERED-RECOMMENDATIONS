import React, { useEffect } from 'react';
import BPForm from '../components/BPForm';
import BPReadingsTable from '../components/BPReadingsTable';
import BPChart from '../components/BPChart';
import { useBPStore } from '../store/bpStore';
import { useAuthStore } from '../store/authStore';

const Dashboard: React.FC = () => {
  const { fetchReadings } = useBPStore();
  const { profile } = useAuthStore();

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {profile?.full_name ? `Welcome, ${profile.full_name}` : 'Welcome to BP Monitor'}
        </h1>
        <p className="text-gray-600">Track and manage your blood pressure readings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BPForm onSuccess={fetchReadings} />
        </div>
        <div className="lg:col-span-2">
          <BPChart />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Readings</h2>
        <BPReadingsTable limit={5} />
      </div>
    </div>
  );
};

export default Dashboard;