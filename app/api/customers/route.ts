import { NextResponse } from 'next/server'
import { PrismaClient } from '@/app/generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
  const customers = await prisma.customer.findMany()
  return NextResponse.json(customers)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const customer = await prisma.customer.create({
    data: { name, email },
  })

  return NextResponse.json(customer)
}
