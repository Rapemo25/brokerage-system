import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { authenticateRequest } from '@/lib/auth'
import { z } from 'zod'

const accountSchema = z.object({
  currency: z.string().length(3).toUpperCase(),
})

export async function GET(req: NextRequest) {
  const user = await authenticateRequest(req)
  if (user instanceof NextResponse) return user

  try {
    const { data: accounts, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch accounts' },
        { status: 500 }
      )
    }

    return NextResponse.json(accounts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const user = await authenticateRequest(req)
  if (user instanceof NextResponse) return user

  try {
    const body = await req.json()
    const { currency } = accountSchema.parse(body)

    const { data: account, error } = await supabase
      .from('accounts')
      .insert({
        user_id: user.id,
        balance: 0,
        currency: currency,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      )
    }

    return NextResponse.json(account)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
} 