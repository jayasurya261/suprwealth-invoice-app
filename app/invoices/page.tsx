'use client'

import { useEffect, useState } from 'react'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [customerId, setCustomerId] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('unpaid')

  const fetchInvoices = async () => {
    const res = await fetch('/api/invoices')
    const data = await res.json()
    setInvoices(data)
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault()

    await fetch('/api/invoices', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerId: Number(customerId),
    amount: Number(amount),         
    status,
  }),
})


    setCustomerId('')
    setAmount('')
    setStatus('unpaid')
    fetchInvoices()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>

      <form onSubmit={createInvoice} className="mb-6 space-y-2 bg-white p-4 rounded shadow w-full md:w-96">
        <h2 className="text-lg font-semibold">Create Invoice</h2>
        <input
          placeholder="Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="border p-2 rounded w-full text-black"
        />
        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-full text-black"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded w-full text-black"
        >
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Add Invoice</button>
      </form>

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
          {invoices.map((invoice: any) => (
            <tr key={invoice.id} className="border-t">
              <td className="p-2">{invoice.customer?.name}</td>
              <td className="p-2">₹{invoice.amount}</td>
              <td className="p-2 capitalize">{invoice.status}</td>
              <td className="p-2">{new Date(invoice.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
