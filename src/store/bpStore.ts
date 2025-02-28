import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { getLifestyleRecommendations } from '../lib/gemini';
import { useAuthStore } from './authStore';

interface BPReading {
  id: string;
  created_at: string;
  user_id: string;
  systolic: number;
  diastolic: number;
  diagnosis: string;
  notes: string | null;
}

interface Recommendation {
  id: string;
  created_at: string;
  user_id: string;
  bp_reading_id: string;
  content: any;
}

interface BPState {
  readings: BPReading[];
  currentReading: BPReading | null;
  recommendations: Record<string, Recommendation>;
  loading: boolean;
  error: string | null;
  
  fetchReadings: () => Promise<void>;
  addReading: (systolic: number, diastolic: number, notes?: string) => Promise<{ data?: BPReading; error: any }>;
  updateReading: (id: string, updates: Partial<BPReading>) => Promise<{ error: any }>;
  deleteReading: (id: string) => Promise<{ error: any }>;
  getDiagnosis: (systolic: number, diastolic: number) => string;
  getRecommendations: (readingId: string) => Promise<{ data?: any; error: any }>;
}

export const useBPStore = create<BPState>((set, get) => ({
  readings: [],
  currentReading: null,
  recommendations: {},
  loading: false,
  error: null,

  fetchReadings: async () => {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      set({ error: 'User not authenticated' });
      return;
    }
    
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('bp_readings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      set({ readings: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  addReading: async (systolic, diastolic, notes = '') => {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      return { error: 'User not authenticated' };
    }
    
    try {
      set({ loading: true, error: null });
      
      const diagnosis = get().getDiagnosis(systolic, diastolic);
      
      const { data, error } = await supabase
        .from('bp_readings')
        .insert({
          user_id: user.id,
          systolic,
          diastolic,
          diagnosis,
          notes,
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Update readings list
      set((state) => ({
        readings: [data, ...state.readings],
        currentReading: data,
      }));
      
      // Generate recommendations
      const profile = useAuthStore.getState().profile;
      
      if (profile) {
        const bpData = {
          systolic,
          diastolic,
          diagnosis,
        };
        
        const userProfile = {
          fullName: profile.full_name || 'User',
          age: profile.age || 30,
          gender: profile.gender || 'Not specified',
        };
        
        const recommendations = await getLifestyleRecommendations(bpData, userProfile);
        
        if (!recommendations.error) {
          const { error: recError } = await supabase
            .from('recommendations')
            .insert({
              user_id: user.id,
              bp_reading_id: data.id,
              content: recommendations,
            });
            
          if (recError) {
            console.error('Error saving recommendations:', recError);
          } else {
            // Update recommendations in state
            set((state) => ({
              recommendations: {
                ...state.recommendations,
                [data.id]: {
                  id: data.id,
                  created_at: data.created_at,
                  user_id: user.id,
                  bp_reading_id: data.id,
                  content: recommendations,
                },
              },
            }));
          }
        }
      }
      
      return { data, error: null };
    } catch (error: any) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ loading: false });
    }
  },

  updateReading: async (id, updates) => {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      return { error: 'User not authenticated' };
    }
    
    try {
      set({ loading: true, error: null });
      
      // If systolic or diastolic is updated, recalculate diagnosis
      if (updates.systolic !== undefined || updates.diastolic !== undefined) {
        const reading = get().readings.find((r) => r.id === id);
        
        if (reading) {
          const systolic = updates.systolic !== undefined ? updates.systolic : reading.systolic;
          const diastolic = updates.diastolic !== undefined ? updates.diastolic : reading.diastolic;
          
          updates.diagnosis = get().getDiagnosis(systolic, diastolic);
        }
      }
      
      const { error } = await supabase
        .from('bp_readings')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Update readings list
      set((state) => ({
        readings: state.readings.map((reading) =>
          reading.id === id ? { ...reading, ...updates } : reading
        ),
      }));
      
      return { error: null };
    } catch (error: any) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ loading: false });
    }
  },

  deleteReading: async (id) => {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      return { error: 'User not authenticated' };
    }
    
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('bp_readings')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Update readings list
      set((state) => ({
        readings: state.readings.filter((reading) => reading.id !== id),
        recommendations: {
          ...state.recommendations,
          [id]: undefined,
        },
      }));
      
      return { error: null };
    } catch (error: any) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ loading: false });
    }
  },

  getDiagnosis: (systolic, diastolic) => {
    if (systolic > 180 || diastolic > 120) {
      return 'Hypertensive Crisis';
    } else if (systolic >= 140 || diastolic >= 90) {
      return 'Hypertension Stage 2';
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      return 'Hypertension Stage 1';
    } else if ((systolic >= 120 && systolic <= 129) && diastolic < 80) {
      return 'Elevated';
    } else {
      return 'Normal';
    }
  },

  getRecommendations: async (readingId) => {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      return { error: 'User not authenticated' };
    }
    
    // Check if we already have the recommendations in state
    const cachedRec = get().recommendations[readingId];
    
    if (cachedRec) {
      return { data: cachedRec.content, error: null };
    }
    
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('bp_reading_id', readingId)
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      // Update recommendations in state
      set((state) => ({
        recommendations: {
          ...state.recommendations,
          [readingId]: data,
        },
      }));
      
      return { data: data.content, error: null };
    } catch (error: any) {
      // If no recommendation exists, generate one
      const reading = get().readings.find((r) => r.id === readingId);
      
      if (reading) {
        const profile = useAuthStore.getState().profile;
        
        if (profile) {
          const bpData = {
            systolic: reading.systolic,
            diastolic: reading.diastolic,
            diagnosis: reading.diagnosis,
          };
          
          const userProfile = {
            fullName: profile.full_name || 'User',
            age: profile.age || 30,
            gender: profile.gender || 'Not specified',
          };
          
          const recommendations = await getLifestyleRecommendations(bpData, userProfile);
          
          if (!recommendations.error) {
            const { error: recError } = await supabase
              .from('recommendations')
              .insert({
                user_id: user.id,
                bp_reading_id: readingId,
                content: recommendations,
              });
              
            if (recError) {
              console.error('Error saving recommendations:', recError);
              return { error: recError };
            } else {
              // Update recommendations in state
              set((state) => ({
                recommendations: {
                  ...state.recommendations,
                  [readingId]: {
                    id: readingId,
                    created_at: reading.created_at,
                    user_id: user.id,
                    bp_reading_id: readingId,
                    content: recommendations,
                  },
                },
              }));
              
              return { data: recommendations, error: null };
            }
          } else {
            return { error: recommendations.error };
          }
        }
      }
      
      set({ error: error.message });
      return { error };
    } finally {
      set({ loading: false });
    }
  },
}));