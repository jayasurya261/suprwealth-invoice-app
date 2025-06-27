'use client'

import { useEffect, useState } from 'react'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const fetchCustomers = async () => {
    const res = await fetch('/api/customers')
    const data = await res.json()
    setCustomers(data)
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const createCustomer = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    })

    if (res.ok) {
      setName('')
      setEmail('')
      fetchCustomers()
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to add customer')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>

      <form onSubmit={createCustomer} className="mb-6 space-y-2 bg-white p-4 rounded shadow w-full md:w-96">
        <h2 className="text-lg font-semibold">Add Customer</h2>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full text-black"
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full text-black"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Add</button>
      </form>

      <table className="w-full bg-white shadow rounded text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer: any) => (
            <tr key={customer.id} className="border-t">
              <td className="p-2">{customer.name}</td>
              <td className="p-2">{customer.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
