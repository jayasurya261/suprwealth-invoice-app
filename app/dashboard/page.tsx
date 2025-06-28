'use client'

import { useEffect, useState } from 'react'
import RevenueChart from '@/components/RevenueChart'

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
  const [revenueData, setRevenueData] = useState([])

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

    const fetchRevenue = async () => {
      const res = await fetch('/api/dashboard/revenue')
      const data = await res.json()
      setRevenueData(data)
    }

    fetchStats()
    fetchInvoices()
    fetchRevenue()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-black">
        <Card title="Customers" value={stats.customers} />
        <Card title="Invoices" value={stats.invoices} />
        <Card title="Paid" value={stats.paidInvoices} />
        <Card title="Unpaid" value={stats.unpaidInvoices} />
      </div>

      <h2 className="text-xl font-bold mb-2">Monthly Revenue</h2>
      <RevenueChart data={revenueData} />

      <h2 className="text-xl font-bold mt-6 mb-2">Latest Invoices</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded text-left text-black">
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
