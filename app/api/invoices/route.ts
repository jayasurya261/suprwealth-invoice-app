import { PrismaClient } from '@/app/generated/prisma'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET all invoices
export async function GET() {
  const invoices = await prisma.invoice.findMany({
    include: { customer: true },
    orderBy: { date: 'desc' },
  })
  return NextResponse.json(invoices)
}

// CREATE a new invoice
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { customerId, amount, status } = body

  const invoice = await prisma.invoice.create({
    data: {
      customerId,
      amount,
      status,
      date: new Date(),
    },
  })

  return NextResponse.json(invoice)
}
