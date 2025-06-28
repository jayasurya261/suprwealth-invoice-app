// app/api/invoices/[id]/route.ts

import { PrismaClient } from '@/app/generated/prisma'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } } // ✅ INLINE type only
) {
  try {
    const invoiceId = parseInt(context.params.id)

    if (isNaN(invoiceId)) {
      return NextResponse.json({ error: 'Invalid invoice ID' }, { status: 400 })
    }

    const { status } = await request.json()

    if (!['paid', 'unpaid'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status },
    })

    return NextResponse.json(updatedInvoice)
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
