// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // 1. Create user
  const user = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
    },
  })

  // 2. Create customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  })

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
  })

  // 3. Create invoices
  await prisma.invoice.createMany({
    data: [
      {
        customerId: customer1.id,
        amount: 1200,
        status: 'paid',
        date: new Date(),
      },
      {
        customerId: customer2.id,
        amount: 800,
        status: 'unpaid',
        date: new Date(),
      },
    ],
  })

  // 4. Create revenue
  await prisma.revenue.createMany({
    data: [
      { month: 5, year: 2025, total: 2000 },
      { month: 6, year: 2025, total: 3500 },
    ],
  })

  console.log('🌱 Database seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
