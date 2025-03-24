import { NextRequest, NextResponse } from 'next/server'
import { supabase } from './supabase'
import type { User } from './supabase'

export async function hashPassword(password: string): Promise<string> {
  const { data, error } = await supabase.auth.signUp({
    email: 'temp@example.com', // This will be replaced with actual email
    password,
  })
  if (error) throw error
  return password // Supabase handles password hashing
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'temp@example.com', // This will be replaced with actual email
    password,
  })
  if (error) return false
  return true
}

export async function verifyToken(token: string): Promise<string> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error) throw error
    return user.id
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export async function authenticateRequest(req: NextRequest): Promise<User | NextResponse> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return user as User
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }
} 