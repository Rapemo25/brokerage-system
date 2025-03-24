import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await authenticateRequest(req)
  if (!(user instanceof NextResponse)) {
    const accounts = await prisma.account.findMany({
      where: { userId: user.id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    return NextResponse.json({ accounts })
  }
  return user
} 