import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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
    const account = await prisma.account.findFirst({
      where: { id: accountId, userId: user.id },
    })

    if (!account) {
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
  const transaction = await prisma.$transaction(async (tx) => {
    const updatedAccount = await tx.account.update({
      where: { id: account.id },
      data: { balance: { increment: amount } },
    })

    const transaction = await tx.transaction.create({
      data: {
        accountId: account.id,
        userId: account.userId,
        type: 'DEPOSIT',
        amount,
        status: 'COMPLETED',
      },
    })

    return { updatedAccount, transaction }
  })

  return NextResponse.json(transaction)
}

async function handleWithdrawal(account: any, amount: number) {
  if (account.balance < amount) {
    return NextResponse.json(
      { error: 'Insufficient funds' },
      { status: 400 }
    )
  }

  const transaction = await prisma.$transaction(async (tx) => {
    const updatedAccount = await tx.account.update({
      where: { id: account.id },
      data: { balance: { decrement: amount } },
    })

    const transaction = await tx.transaction.create({
      data: {
        accountId: account.id,
        userId: account.userId,
        type: 'WITHDRAWAL',
        amount,
        status: 'COMPLETED',
      },
    })

    return { updatedAccount, transaction }
  })

  return NextResponse.json(transaction)
}

async function handleTransfer(fromAccount: any, toAccountId: string, amount: number) {
  if (fromAccount.balance < amount) {
    return NextResponse.json(
      { error: 'Insufficient funds' },
      { status: 400 }
    )
  }

  const toAccount = await prisma.account.findUnique({
    where: { id: toAccountId },
  })

  if (!toAccount) {
    return NextResponse.json(
      { error: 'Destination account not found' },
      { status: 404 }
    )
  }

  const transaction = await prisma.$transaction(async (tx) => {
    // Deduct from source account
    const updatedFromAccount = await tx.account.update({
      where: { id: fromAccount.id },
      data: { balance: { decrement: amount } },
    })

    // Add to destination account
    const updatedToAccount = await tx.account.update({
      where: { id: toAccountId },
      data: { balance: { increment: amount } },
    })

    // Create transaction record
    const transaction = await tx.transaction.create({
      data: {
        accountId: fromAccount.id,
        userId: fromAccount.userId,
        type: 'TRANSFER',
        amount,
        status: 'COMPLETED',
      },
    })

    return { updatedFromAccount, updatedToAccount, transaction }
  })

  return NextResponse.json(transaction)
} 