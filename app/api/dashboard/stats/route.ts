import { NextResponse } from 'next/server'
import { PrismaClient } from '@/app/generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
  const customers = await prisma.customer.count()
  const invoices = await prisma.invoice.count()
  const paidInvoices = await prisma.invoice.count({ where: { status: 'paid' } })
  const unpaidInvoices = await prisma.invoice.count({ where: { status: 'unpaid' } })

  return NextResponse.json({
    customers,
    invoices,
    paidInvoices,
    unpaidInvoices,
  })
}
