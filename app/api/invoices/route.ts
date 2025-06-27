import { PrismaClient } from '@/app/generated/prisma'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET all invoices
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { customer: true },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('GET /api/invoices error:', error)
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
  }
}

// CREATE a new invoice
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerId, amount, status } = body

    if (!customerId || !amount || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId, amount, or status' },
        { status: 400 }
      )
    }

    const invoice = await prisma.invoice.create({
      data: {
        customerId: Number(customerId),
        amount: Number(amount),
        status,
        date: new Date(),
      },
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('POST /api/invoices error:', error)
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}
