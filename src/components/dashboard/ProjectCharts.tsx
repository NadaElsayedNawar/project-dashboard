'use client'

import { useMemo, useEffect, useState } from 'react'
import { Project, ProjectStatus } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from '@/components/theme-provider'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ProjectChartsProps {
  projects: Project[]
}

const STATUS_COLORS: Record<ProjectStatus, { light: string; dark: string }> = {
  Planning: { light: '#94a3b8', dark: '#64748b' },
  InProgress: { light: '#3b82f6', dark: '#60a5fa' },
  OnHold: { light: '#f59e0b', dark: '#fbbf24' },
  Completed: { light: '#10b981', dark: '#34d399' },
  Cancelled: { light: '#ef4444', dark: '#f87171' },
}

const CHART_COLORS = {
  progress: { light: '#3b82f6', dark: '#60a5fa' },
  budget: { light: '#10b981', dark: '#34d399' },
  grid: { light: '#e5e7eb', dark: '#374151' },
  text: { light: '#374151', dark: '#d1d5db' },
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-sm mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
            {entry.name.includes('Budget') ? 'k' : ''}
            {entry.name.includes('Progress') ? '%' : ''}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ProjectCharts({ projects }: ProjectChartsProps) {
  const { theme } = useTheme()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      if (theme === 'system') {
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
      } else {
        setIsDark(theme === 'dark')
      }
    }
    checkTheme()
  }, [theme])

  const statusData = useMemo(() => {
    const statusCounts: Record<ProjectStatus, number> = {
      Planning: 0,
      InProgress: 0,
      OnHold: 0,
      Completed: 0,
      Cancelled: 0,
    }

    projects.forEach((project) => {
      statusCounts[project.status]++
    })

    return Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: status === 'InProgress' ? 'In Progress' : status === 'OnHold' ? 'On Hold' : status,
        value: count,
        color: isDark
          ? STATUS_COLORS[status as ProjectStatus].dark
          : STATUS_COLORS[status as ProjectStatus].light,
      }))
  }, [projects, isDark])

  const progressData = useMemo(() => {
    return [...projects]
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 10)
      .map((project) => ({
        name: project.name.length > 20 ? project.name.substring(0, 20) + '...' : project.name,
        progress: project.progress,
      }))
  }, [projects])

  const budgetData = useMemo(() => {
    return [...projects]
      .sort((a, b) => b.budget - a.budget)
      .slice(0, 5)
      .map((project) => ({
        name: project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name,
        budget: project.budget / 1000,
      }))
  }, [projects])

  const gridColor = isDark ? CHART_COLORS.grid.dark : CHART_COLORS.grid.light
  const textColor = isDark ? CHART_COLORS.text.dark : CHART_COLORS.text.light
  const progressColor = isDark ? CHART_COLORS.progress.dark : CHART_COLORS.progress.light
  const budgetColor = isDark ? CHART_COLORS.budget.dark : CHART_COLORS.budget.light

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Project Status Distribution</CardTitle>
          <CardDescription>Breakdown by current project status</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={{
                  stroke: textColor,
                  strokeWidth: 1,
                }}
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`
                }
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={isDark ? '#1f2937' : '#ffffff'}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Project Progress Overview</CardTitle>
          <CardDescription>Top 10 projects ranked by completion percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={progressData} margin={{ top: 5, right: 30, left: 0, bottom: 70 }}>
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={progressColor} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={progressColor} stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={11}
                stroke={textColor}
              />
              <YAxis
                domain={[0, 100]}
                stroke={textColor}
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                iconType="circle"
              />
              <Bar
                dataKey="progress"
                fill="url(#colorProgress)"
                name="Progress %"
                radius={[8, 8, 0, 0]}
                animationBegin={0}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Budget Allocation Analysis</CardTitle>
          <CardDescription>Top 5 projects with highest budget allocation (in thousands USD)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={budgetData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorBudget" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor={budgetColor} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={budgetColor} stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
              <XAxis type="number" stroke={textColor} fontSize={12} />
              <YAxis
                dataKey="name"
                type="category"
                width={160}
                fontSize={12}
                stroke={textColor}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                iconType="circle"
              />
              <Bar
                dataKey="budget"
                fill="url(#colorBudget)"
                name="Budget ($k)"
                radius={[0, 8, 8, 0]}
                animationBegin={0}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
