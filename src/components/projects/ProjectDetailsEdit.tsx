'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Project, ProjectStatus } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormField, FormMessage } from '@/components/ui/form'

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['Planning', 'InProgress', 'OnHold', 'Completed', 'Cancelled']),
  startDate: z.string(),
  endDate: z.string(),
  progress: z.number().min(0).max(100),
  budget: z.number().min(0),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectDetailsEditProps {
  project: Project
  onSave: (project: Project) => void
  onCancel: () => void
}

export function ProjectDetailsEdit({
  project,
  onSave,
  onCancel,
}: ProjectDetailsEditProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      progress: project.progress,
      budget: project.budget,
    },
  })

  const onSubmit = (data: ProjectFormData) => {
    onSave({
      ...project,
      ...data,
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Project Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField>
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              {...register('name')}
              aria-invalid={!!errors.name}
            />
            {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
          </FormField>

          <FormField>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...register('description')}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <FormMessage>{errors.description.message}</FormMessage>
            )}
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                {...register('status')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="Planning">Planning</option>
                <option value="InProgress">In Progress</option>
                <option value="OnHold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {errors.status && <FormMessage>{errors.status.message}</FormMessage>}
            </FormField>

            <FormField>
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                {...register('progress', { valueAsNumber: true })}
                aria-invalid={!!errors.progress}
              />
              {errors.progress && (
                <FormMessage>{errors.progress.message}</FormMessage>
              )}
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                aria-invalid={!!errors.startDate}
              />
              {errors.startDate && (
                <FormMessage>{errors.startDate.message}</FormMessage>
              )}
            </FormField>

            <FormField>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                aria-invalid={!!errors.endDate}
              />
              {errors.endDate && (
                <FormMessage>{errors.endDate.message}</FormMessage>
              )}
            </FormField>
          </div>

          <FormField>
            <Label htmlFor="budget">Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              min="0"
              {...register('budget', { valueAsNumber: true })}
              aria-invalid={!!errors.budget}
            />
            {errors.budget && <FormMessage>{errors.budget.message}</FormMessage>}
          </FormField>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
