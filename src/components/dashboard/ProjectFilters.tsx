'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ProjectStatus, TaskPriority } from '@/types'

interface ProjectFiltersProps {
  search: string
  status: ProjectStatus | 'All'
  onSearchChange: (value: string) => void
  onStatusChange: (value: ProjectStatus | 'All') => void
}

export function ProjectFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Label htmlFor="search" className="sr-only">
          Search projects
        </Label>
        <Input
          id="search"
          type="search"
          placeholder="Search projects by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="sm:w-48">
        <Label htmlFor="status" className="sr-only">
          Filter by status
        </Label>
        <select
          id="status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ProjectStatus | 'All')}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="All">All Statuses</option>
          <option value="Planning">Planning</option>
          <option value="InProgress">In Progress</option>
          <option value="OnHold">On Hold</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  )
}
