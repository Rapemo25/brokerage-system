import { NextRequest, NextResponse } from 'next/server'
import { prisma } from './prisma'
import { supabase } from './supabase'

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

export async function authenticateRequest(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const userId = await verifyToken(token)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    return user
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
} 