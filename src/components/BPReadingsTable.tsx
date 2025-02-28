import React, { useState } from 'react';
import { useBPStore } from '../store/bpStore';
import { Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BPReadingsTableProps {
  limit?: number;
}

const BPReadingsTable: React.FC<BPReadingsTableProps> = ({ limit }) => {
  const { readings, loading, deleteReading } = useBPStore();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  const displayedReadings = limit ? readings.slice(0, limit) : readings;

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    await deleteReading(id);
    setIsDeleting(null);
  };

  const handleView = (id: string) => {
    navigate(`/reading/${id}`);
  };

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

  if (loading && readings.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (readings.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No blood pressure readings recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Reading
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Diagnosis
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Notes
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedReadings.map((reading) => (
              <tr key={reading.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(reading.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {reading.systolic}/{reading.diastolic} mmHg
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDiagnosisColor(
                      reading.diagnosis
                    )}`}
                  >
                    {reading.diagnosis}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {reading.notes || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleView(reading.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(reading.id)}
                    disabled={isDeleting === reading.id}
                    className="text-red-600 hover:text-red-900"
                  >
                    {isDeleting === reading.id ? (
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BPReadingsTable;