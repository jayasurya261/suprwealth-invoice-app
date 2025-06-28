// pages/api/invoices/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@/app/generated/prisma'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (req.method === 'PATCH') {
    try {
      const invoiceId = parseInt(id as string)
      const { status } = req.body

      if (!['paid', 'unpaid'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' })
      }

      const updatedInvoice = await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status },
      })

      return res.status(200).json(updatedInvoice)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Server error' })
    }
  } else {
    res.setHeader('Allow', ['PATCH'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
