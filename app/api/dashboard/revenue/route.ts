import { PrismaClient } from '@/app/generated/prisma'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const revenue = await prisma.revenue.findMany({
    orderBy: {
      month: 'asc',
    },
  })

  return NextResponse.json(revenue)
}
