import { PrismaClient } from '@/app/generated/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Prisma client
const prisma = new PrismaClient()

// Define the expected params type
interface Params {
  id: string
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Params } // ✅ Use explicit interface for params
) {
  try {
    const invoiceId = parseInt(params.id)
    const body = await req.json()
    const { status } = body

    if (!status || !['paid', 'unpaid'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updated = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}