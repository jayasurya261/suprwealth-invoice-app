import { PrismaClient } from '@/app/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';
import type { Params } from 'next/dist/server/request/params';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params } // Use the Next.js Params type
) {
  try {
    const invoiceId = parseInt(params.id);

    if (isNaN(invoiceId)) {
      return NextResponse.json({ error: 'Invalid invoice ID' }, { status: 400 });
    }

    const { status } = await request.json();

    if (!['paid', 'unpaid'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}