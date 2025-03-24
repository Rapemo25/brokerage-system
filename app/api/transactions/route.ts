import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { authenticateRequest } from '@/lib/auth'
import { z } from 'zod'

const transactionSchema = z.object({
  accountId: z.string(),
  type: z.enum(['DEPOSIT', 'WITHDRAWAL', 'TRANSFER']),
  amount: z.number().positive(),
  toAccountId: z.string().optional(), // For transfers
})

export async function POST(req: NextRequest) {
  const user = await authenticateRequest(req)
  if (user instanceof NextResponse) return user

  try {
    const body = await req.json()
    const { accountId, type, amount, toAccountId } = transactionSchema.parse(body)

    // Verify account ownership
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .eq('user_id', user.id)
      .single()

    if (accountError || !account) {
      return NextResponse.json(
        { error: 'Account not found or unauthorized' },
        { status: 404 }
      )
    }

    // Handle different transaction types
    switch (type) {
      case 'DEPOSIT':
        return handleDeposit(account, amount)
      case 'WITHDRAWAL':
        return handleWithdrawal(account, amount)
      case 'TRANSFER':
        if (!toAccountId) {
          return NextResponse.json(
            { error: 'Destination account is required for transfers' },
            { status: 400 }
          )
        }
        return handleTransfer(account, toAccountId, amount)
      default:
        return NextResponse.json(
          { error: 'Invalid transaction type' },
          { status: 400 }
        )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleDeposit(account: any, amount: number) {
  // Update account balance
  const { error: updateError } = await supabase
    .from('accounts')
    .update({ balance: account.balance + amount })
    .eq('id', account.id)

  if (updateError) {
    return NextResponse.json(
      { error: 'Failed to update account balance' },
      { status: 500 }
    )
  }

  // Create transaction record
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      account_id: account.id,
      user_id: account.user_id,
      type: 'DEPOSIT',
      amount,
      status: 'COMPLETED',
    })
    .select()
    .single()

  if (transactionError) {
    return NextResponse.json(
      { error: 'Failed to create transaction record' },
      { status: 500 }
    )
  }

  return NextResponse.json({ 
    updatedAccount: { ...account, balance: account.balance + amount },
    transaction 
  })
}

async function handleWithdrawal(account: any, amount: number) {
  if (account.balance < amount) {
    return NextResponse.json(
      { error: 'Insufficient funds' },
      { status: 400 }
    )
  }

  // Update account balance
  const { error: updateError } = await supabase
    .from('accounts')
    .update({ balance: account.balance - amount })
    .eq('id', account.id)

  if (updateError) {
    return NextResponse.json(
      { error: 'Failed to update account balance' },
      { status: 500 }
    )
  }

  // Create transaction record
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      account_id: account.id,
      user_id: account.user_id,
      type: 'WITHDRAWAL',
      amount,
      status: 'COMPLETED',
    })
    .select()
    .single()

  if (transactionError) {
    return NextResponse.json(
      { error: 'Failed to create transaction record' },
      { status: 500 }
    )
  }

  return NextResponse.json({ 
    updatedAccount: { ...account, balance: account.balance - amount },
    transaction 
  })
}

async function handleTransfer(fromAccount: any, toAccountId: string, amount: number) {
  if (fromAccount.balance < amount) {
    return NextResponse.json(
      { error: 'Insufficient funds' },
      { status: 400 }
    )
  }

  // Get destination account
  const { data: toAccount, error: toAccountError } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', toAccountId)
    .single()

  if (toAccountError || !toAccount) {
    return NextResponse.json(
      { error: 'Destination account not found' },
      { status: 404 }
    )
  }

  // Update source account balance
  const { error: fromUpdateError } = await supabase
    .from('accounts')
    .update({ balance: fromAccount.balance - amount })
    .eq('id', fromAccount.id)

  if (fromUpdateError) {
    return NextResponse.json(
      { error: 'Failed to update source account' },
      { status: 500 }
    )
  }

  // Update destination account balance
  const { error: toUpdateError } = await supabase
    .from('accounts')
    .update({ balance: toAccount.balance + amount })
    .eq('id', toAccountId)

  if (toUpdateError) {
    return NextResponse.json(
      { error: 'Failed to update destination account' },
      { status: 500 }
    )
  }

  // Create transaction record
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      account_id: fromAccount.id,
      user_id: fromAccount.user_id,
      type: 'TRANSFER',
      amount,
      status: 'COMPLETED',
      to_account_id: toAccountId,
    })
    .select()
    .single()

  if (transactionError) {
    return NextResponse.json(
      { error: 'Failed to create transaction record' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    updatedFromAccount: { ...fromAccount, balance: fromAccount.balance - amount },
    updatedToAccount: { ...toAccount, balance: toAccount.balance + amount },
    transaction,
  })
} 