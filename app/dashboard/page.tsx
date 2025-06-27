'use client'

import { useEffect, useState } from 'react'

type Invoice = {
  id: number
  amount: number
  status: string
  date: string
  customer: {
    name: string
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    customers: 0,
    invoices: 0,
    paidInvoices: 0,
    unpaidInvoices: 0,
    revenue: 0,
  })

  const [latestInvoices, setLatestInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('/api/dashboard/stats')
      const data = await res.json()
      setStats(data)
    }

    const fetchInvoices = async () => {
      const res = await fetch('/api/dashboard/latest-invoices')
      const data = await res.json()
      setLatestInvoices(data)
    }

    fetchStats()
    fetchInvoices()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card title="Customers" value={stats.customers} />
        <Card title="Invoices" value={stats.invoices} />
        <Card title="Paid" value={stats.paidInvoices} />
        <Card title="Unpaid" value={stats.unpaidInvoices} />
      </div>

      {/* Revenue placeholder */}
      <h2 className="text-xl font-bold mb-2">Revenue (Chart Coming Soon)</h2>
      <div className="bg-gray-100 rounded h-40 mb-6 flex items-center justify-center text-gray-600">
        Revenue chart will be shown here.
      </div>

      {/* Latest Invoices */}
      <h2 className="text-xl font-bold mb-2">Latest Invoices</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Customer</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {latestInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-t">
                <td className="p-2">{invoice.customer.name}</td>
                <td className="p-2">₹{invoice.amount}</td>
                <td className="p-2 capitalize">{invoice.status}</td>
                <td className="p-2">{new Date(invoice.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
