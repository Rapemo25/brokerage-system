import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type User = {
  id: string
  email: string
  name?: string
  role: 'USER' | 'ADMIN'
  created_at: string
}

export type Account = {
  id: string
  user_id: string
  balance: number
  currency: string
  created_at: string
}

export type Transaction = {
  id: string
  account_id: string
  user_id: string
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER'
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  created_at: string
}

// Helper function to get user session
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

// Helper function to sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
} 