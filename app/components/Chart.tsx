'use client'

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js'
import { Doughnut, Bar, Line } from 'react-chartjs-2'
import { useEffect, useState } from 'react'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement)

interface PerformanceData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }[]
}

export function PerformanceChart({ type = 'doughnut', data }: { type?: 'doughnut' | 'bar' | 'line', data: PerformanceData }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  if (type === 'doughnut') {
    return <Doughnut data={data} options={options} />
  }

  if (type === 'bar') {
    return <Bar data={data} options={options} />
  }

  if (type === 'line') {
    return <Line data={data} options={options} />
  }

  return null
}

export function StatsCard({ title, value, subtitle, color = 'blue' }: {
  title: string
  value: string | number
  subtitle?: string
  color?: 'blue' | 'green' | 'orange' | 'red'
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  }

  return (
    <div className={`p-6 rounded-lg border-2 ${colorClasses[color]}`}>
      <h3 className="text-sm font-medium opacity-80">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {subtitle && <p className="text-sm mt-1 opacity-70">{subtitle}</p>}
    </div>
  )
}
