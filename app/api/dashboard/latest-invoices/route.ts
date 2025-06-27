import { PrismaClient } from '@/app/generated/prisma'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { date: 'desc' },
    take: 5,
    include: { customer: true },
  })

  return NextResponse.json(invoices)
}
