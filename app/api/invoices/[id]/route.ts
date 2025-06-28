import { PrismaClient } from '@/app/generated/prisma'
import { NextRequest, NextResponse } from 'next/server'
// 👇👇👇 Official internal type for dynamic route context
import type { RouteHandlerContext } from 'next/dist/server/web/types'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  context: RouteHandlerContext // ✅ correct type for dynamic routes
): Promise<NextResponse> {
  try {
    const id = context.params?.id
    const invoiceId = parseInt(id as string)

    if (isNaN(invoiceId)) {
      return NextResponse.json({ error: 'Invalid invoice ID' }, { status: 400 })
    }

    const { status } = await request.json()

    if (!['paid', 'unpaid'].includes(status)) {
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
