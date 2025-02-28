import React, { useState } from 'react';
import { useBPStore } from '../store/bpStore';

interface BPFormProps {
  onSuccess?: () => void;
}

const BPForm: React.FC<BPFormProps> = ({ onSuccess }) => {
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [notes, setNotes] = useState<string>('');
  const { addReading, getDiagnosis, loading } = useBPStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await addReading(systolic, diastolic, notes);
    
    if (!error && onSuccess) {
      onSuccess();
    }
    
    // Reset form
    setNotes('');
  };

  const diagnosis = getDiagnosis(systolic, diastolic);
  
  const getDiagnosisColor = () => {
    switch (diagnosis) {
      case 'Normal':
        return 'text-green-600';
      case 'Elevated':
        return 'text-yellow-600';
      case 'Hypertension Stage 1':
        return 'text-orange-600';
      case 'Hypertension Stage 2':
        return 'text-red-600';
      case 'Hypertensive Crisis':
        return 'text-red-700 font-bold';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Record Blood Pressure</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="systolic" className="block text-sm font-medium text-gray-700 mb-1">
              Systolic (mmHg)
            </label>
            <input
              type="number"
              id="systolic"
              min="70"
              max="250"
              value={systolic}
              onChange={(e) => setSystolic(parseInt(e.target.value))}
              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="diastolic" className="block text-sm font-medium text-gray-700 mb-1">
              Diastolic (mmHg)
            </label>
            <input
              type="number"
              id="diastolic"
              min="40"
              max="180"
              value={diastolic}
              onChange={(e) => setDiastolic(parseInt(e.target.value))}
              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-700">
            Current Reading: <span className="font-medium">{systolic}/{diastolic} mmHg</span>
          </p>
          <p className="text-sm">
            Diagnosis: <span className={`font-medium ${getDiagnosisColor()}`}>{diagnosis}</span>
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {loading ? 'Saving...' : 'Save Reading'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BPForm;