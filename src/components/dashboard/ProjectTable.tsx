'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Project, ProjectStatus } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

interface ProjectTableProps {
  projects: Project[]
  loading: boolean
  onSort: (field: keyof Project) => void
  sortField: keyof Project
  sortOrder: 'asc' | 'desc'
}

export function ProjectTable({
  projects,
  loading,
  onSort,
  sortField,
  sortOrder,
}: ProjectTableProps) {
  const router = useRouter()

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'Completed':
        return 'default'
      case 'InProgress':
        return 'default'
      case 'Planning':
        return 'secondary'
      case 'OnHold':
        return 'outline'
      case 'Cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case 'InProgress':
        return 'In Progress'
      case 'OnHold':
        return 'On Hold'
      default:
        return status
    }
  }

  const SortIcon = ({ field }: { field: keyof Project }) => {
    if (sortField !== field) {
      return <span className="ml-1 text-muted-foreground">⇅</span>
    }
    return <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No projects found</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead >
              <button
                onClick={() => onSort('name')}
                className="flex items-center hover:text-foreground transition-colors"
              >
                Name
                <SortIcon field="name" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => onSort('status')}
                className="flex items-center hover:text-foreground transition-colors"
              >
                Status
                <SortIcon field="status" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => onSort('startDate')}
                className="flex items-center hover:text-foreground transition-colors"
              >
                Start Date
                <SortIcon field="startDate" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => onSort('endDate')}
                className="flex items-center hover:text-foreground transition-colors"
              >
                End Date
                <SortIcon field="endDate" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => onSort('progress')}
                className="flex items-center hover:text-foreground transition-colors"
              >
                Progress
                <SortIcon field="progress" />
              </button>
            </TableHead>
            <TableHead className="text-right">
              <button
                onClick={() => onSort('budget')}
                className="flex items-center ml-auto hover:text-foreground transition-colors"
              >
                Budget
                <SortIcon field="budget" />
              </button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.id}
              className="cursor-pointer"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <TableCell className="font-medium">
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-muted-foreground truncate ">
                    {project.description}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(project.startDate), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                {format(new Date(project.endDate), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {project.progress}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                ${project.budget.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/projects/${project.id}`)
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
