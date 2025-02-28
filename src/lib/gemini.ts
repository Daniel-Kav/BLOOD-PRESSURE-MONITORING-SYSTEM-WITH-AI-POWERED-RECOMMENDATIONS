import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('Missing Gemini API key. Please add VITE_GEMINI_API_KEY to your .env file.');
}

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(API_KEY || '');

export async function getLifestyleRecommendations(
  bpData: { systolic: number; diastolic: number; diagnosis: string },
  userProfile: {
    fullName: string;
    age: number;
    gender: string;
  }
) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
      You are a medical AI assistant specializing in cardiovascular health. 
      
      Patient Information:
      - Name: ${userProfile.fullName}
      - Age: ${userProfile.age}
      - Gender: ${userProfile.gender}
      - Blood Pressure Reading: ${bpData.systolic}/${bpData.diastolic} mmHg
      - Diagnosis: ${bpData.diagnosis}
      
      Based on this information, provide personalized lifestyle recommendations in the following categories:
      
      1. Diet (specific foods to eat and avoid)
      2. Exercise (appropriate physical activities)
      3. Stress Management (techniques to reduce stress)
      4. Sleep & Hydration (optimal patterns and intake)
      5. Medical Advice (when to see a doctor)
      
      Format your response in JSON with the following structure:
      {
        "diet": {
          "recommendations": ["recommendation 1", "recommendation 2", ...],
          "foods_to_eat": ["food 1", "food 2", ...],
          "foods_to_avoid": ["food 1", "food 2", ...]
        },
        "exercise": {
          "recommendations": ["recommendation 1", "recommendation 2", ...],
          "suggested_activities": ["activity 1", "activity 2", ...]
        },
        "stress_management": {
          "recommendations": ["recommendation 1", "recommendation 2", ...],
          "techniques": ["technique 1", "technique 2", ...]
        },
        "sleep_hydration": {
          "sleep_recommendations": ["recommendation 1", "recommendation 2", ...],
          "hydration_tips": ["tip 1", "tip 2", ...]
        },
        "medical_advice": {
          "recommendations": ["recommendation 1", "recommendation 2", ...],
          "warning_signs": ["sign 1", "sign 2", ...]
        }
      }
      
      Ensure your recommendations are evidence-based, personalized to the patient's profile, and appropriate for their blood pressure level.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to parse JSON from Gemini response:', error);
      return {
        error: 'Failed to generate recommendations. Please try again later.',
        rawResponse: text
      };
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return {
      error: 'Failed to generate recommendations. Please try again later.'
    };
  }
}