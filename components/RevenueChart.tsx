'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function RevenueChart({ data }: { data: { month: number; year: number; total: number }[] }) {
  const chartData = {
    labels: data.map((d) => `Month ${d.month}`),
    datasets: [
      {
        label: 'Revenue',
        data: data.map((d) => d.total),
        backgroundColor: '#3b82f6',
      },
    ],
  }

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-2xl">
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  )
}
