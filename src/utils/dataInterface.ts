export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Tasks: {
        Row: {
          created_at: string | null
          deadline: string | null
          description: string | null
          id: number
          image: string | null
          isDone: boolean | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: number
          image?: string | null
          isDone?: boolean | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: number
          image?: string | null
          isDone?: boolean | null
          name?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
