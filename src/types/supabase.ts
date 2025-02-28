export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          age: number | null
          gender: string | null
          email: string | null
          phone: string | null
          emergency_contact: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          age?: number | null
          gender?: string | null
          email?: string | null
          phone?: string | null
          emergency_contact?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          age?: number | null
          gender?: string | null
          email?: string | null
          phone?: string | null
          emergency_contact?: string | null
        }
      }
      bp_readings: {
        Row: {
          id: string
          created_at: string
          user_id: string
          systolic: number
          diastolic: number
          diagnosis: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          systolic: number
          diastolic: number
          diagnosis: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          systolic?: number
          diastolic?: number
          diagnosis?: string
          notes?: string | null
        }
      }
      recommendations: {
        Row: {
          id: string
          created_at: string
          user_id: string
          bp_reading_id: string
          content: Json
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          bp_reading_id: string
          content: Json
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          bp_reading_id?: string
          content?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}