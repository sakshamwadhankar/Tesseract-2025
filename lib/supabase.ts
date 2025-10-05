import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://lwyxcndmbpotaegbzswh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eXhjbmRtYnBvdGFlZ2J6c3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NTUzNTAsImV4cCI6MjA3NTEzMTM1MH0.r3M_CMzMxo8r5R3B_DQzNnMcYDfKrNwCIQuyRoHYX7Y'

// Service role key for admin operations (use with caution)
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eXhjbmRtYnBvdGFlZ2J6c3doIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU1NTM1MCwiZXhwIjoyMDc1MTMxMzUwfQ.ucLEBpg0b4U8kiAY11bPSCwa_c1L7M1DOZBeYx15O7Y'

// Create Supabase client instances
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service role key (for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

// Types for our database tables
export interface Project {
  id: number
  team_name: string
  project_url: string
  is_unlocked: boolean
}

export interface Vote {
  id: number
  user_id: string
  project_id: number
  created_at: string
}

export interface Admin {
  user_id: string
  is_admin: boolean
}
