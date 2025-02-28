import React from 'react';
import { useBPStore } from '../store/bpStore';

interface RecommendationCardProps {
  readingId: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ readingId }) => {
  const [recommendations, setRecommendations] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { getRecommendations } = useBPStore();

  React.useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const { data, error } = await getRecommendations(readingId);
        
        if (error) {
          setError(error.message || 'Failed to load recommendations');
        } else {
          setRecommendations(data);
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [readingId, getRecommendations]);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">No recommendations available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          AI-Generated Lifestyle Recommendations
        </h2>
        
        <div className="space-y-6">
          {/* Diet Section */}
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">Diet Recommendations</h3>
            <div className="bg-green-50 p-4 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                {recommendations.diet?.recommendations?.map((rec: string, i: number) => (
                  <li key={i} className="text-sm text-gray-700">{rec}</li>
                ))}
              </ul>
              
              {recommendations.diet?.foods_to_eat && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">Foods to Eat:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recommendations.diet.foods_to_eat.map((food: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {recommendations.diet?.foods_to_avoid && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">Foods to Avoid:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recommendations.diet.foods_to_avoid.map((food: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Exercise Section */}
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">Exercise Recommendations</h3>
            <div className="bg-blue-50 p-4 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                {recommendations.exercise?.recommendations?.map((rec: string, i: number) => (
                  <li key={i} className="text-sm text-gray-700">{rec}</li>
                ))}
              </ul>
              
              {recommendations.exercise?.suggested_activities && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">Suggested Activities:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recommendations.exercise.suggested_activities.map((activity: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Stress Management Section */}
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">Stress Management</h3>
            <div className="bg-purple-50 p-4 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                {recommendations.stress_management?.recommendations?.map((rec: string, i: number) => (
                  <li key={i} className="text-sm text-gray-700">{rec}</li>
                ))}
              </ul>
              
              {recommendations.stress_management?.techniques && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">Techniques:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recommendations.stress_management.techniques.map((technique: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {technique}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sleep & Hydration Section */}
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">Sleep & Hydration</h3>
            <div className="bg-indigo-50 p-4 rounded-md">
              {recommendations.sleep_hydration?.sleep_recommendations && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Sleep:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {recommendations.sleep_hydration.sleep_recommendations.map((rec: string, i: number) => (
                      <li key={i} className="text-sm text-gray-700">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {recommendations.sleep_hydration?.hydration_tips && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">Hydration:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {recommendations.sleep_hydration.hydration_tips.map((tip: string, i: number) => (
                      <li key={i} className="text-sm text-gray-700">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Medical Advice Section */}
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">Medical Advice</h3>
            <div className="bg-yellow-50 p-4 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                {recommendations.medical_advice?.recommendations?.map((rec: string, i: number) => (
                  <li key={i} className="text-sm text-gray-700">{rec}</li>
                ))}
              </ul>
              
              {recommendations.medical_advice?.warning_signs && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 text-red-600">Warning Signs - Seek Medical Help If:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {recommendations.medical_advice.warning_signs.map((sign: string, i: number) => (
                      <li key={i} className="text-sm text-red-600">{sign}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-xs text-gray-500">
          <p>
            Note: These recommendations are generated by AI and should not replace professional
            medical advice. Always consult with your healthcare provider before making significant
            changes to your lifestyle or treatment plan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;