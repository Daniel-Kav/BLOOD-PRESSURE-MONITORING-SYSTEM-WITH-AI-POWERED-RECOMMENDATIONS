import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBPStore } from '../store/bpStore';
import RecommendationCard from '../components/RecommendationCard';
import { ArrowLeft } from 'lucide-react';

const ReadingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { readings, fetchReadings } = useBPStore();
  const [reading, setReading] = useState<any>(null);

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  useEffect(() => {
    if (id && readings.length > 0) {
      const foundReading = readings.find((r) => r.id === id);
      setReading(foundReading);
    }
  }, [id, readings]);

  if (!reading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const getDiagnosisColor = (diagnosis: string) => {
    switch (diagnosis) {
      case 'Normal':
        return 'bg-green-100 text-green-800';
      case 'Elevated':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hypertension Stage 1':
        return 'bg-orange-100 text-orange-800';
      case 'Hypertension Stage 2':
        return 'bg-red-100 text-red-800';
      case 'Hypertensive Crisis':
        return 'bg-red-100 text-red-800 font-bold';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900">Blood Pressure Reading</h1>
        <p className="text-gray-600">
          Recorded on {new Date(reading.created_at).toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Reading Details</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Blood Pressure</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reading.systolic}/{reading.diastolic} <span className="text-sm font-normal">mmHg</span>
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Diagnosis</p>
                <span
                  className={`px-2 py-1 inline-flex text-sm font-semibold rounded-md ${getDiagnosisColor(
                    reading.diagnosis
                  )}`}
                >
                  {reading.diagnosis}
                </span>
              </div>
              
              {reading.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-gray-700">{reading.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {id && <RecommendationCard readingId={id} />}
        </div>
      </div>
    </div>
  );
};

export default ReadingDetail;