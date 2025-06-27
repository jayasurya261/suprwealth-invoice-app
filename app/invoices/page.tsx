'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [customers, setCustomers] = useState([])
  const [customerId, setCustomerId] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('unpaid')

  const fetchData = async () => {
    try {
      const [invoiceRes, customerRes] = await Promise.all([
        fetch('/api/invoices'),
        fetch('/api/customers'),
      ])
      const invoiceData = await invoiceRes.json()
      const customerData = await customerRes.json()
      setInvoices(invoiceData)
      setCustomers(customerData)
    } catch {
      toast.error('Failed to fetch data')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerId || !amount) {
      toast.error('Please fill all fields')
      return
    }

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: Number(customerId),
          amount: Number(amount),
          status,
        }),
      })

      if (res.ok) {
        toast.success('Invoice created')
        setCustomerId('')
        setAmount('')
        setStatus('unpaid')
        fetchData()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to create invoice')
      }
    } catch {
      toast.error('Failed to create invoice')
    }
  }

  const markAsPaid = async (id: number) => {
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' }), // ✅ Important
      })

      if (res.ok) {
        toast.success('Marked as paid')
        fetchData()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to update status')
      }
    } catch {
      toast.error('Failed to update invoice')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>

      <form onSubmit={createInvoice} className="mb-6 space-y-2 bg-white p-4 rounded shadow w-full md:w-96">
        <h2 className="text-lg font-semibold">Create Invoice</h2>

        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="border p-2 rounded w-full text-black"
        >
          <option value="">Select Customer</option>
          {customers.map((cust: any) => (
            <option key={cust.id} value={cust.id}>
              {cust.name}
            </option>
          ))}
        </select>

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

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Add Invoice
        </button>
      </form>

      <table className="w-full bg-white shadow rounded text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Customer</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice: any) => (
            <tr key={invoice.id} className="border-t">
              <td className="p-2">{invoice.customer?.name}</td>
              <td className="p-2">₹{invoice.amount}</td>
              <td className="p-2 capitalize">{invoice.status}</td>
              <td className="p-2">{new Date(invoice.date).toLocaleDateString()}</td>
              <td className="p-2">
                {invoice.status === 'unpaid' && (
                  <button
                    className="text-green-600 underline"
                    onClick={() => markAsPaid(invoice.id)}
                  >
                    Mark as Paid
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
