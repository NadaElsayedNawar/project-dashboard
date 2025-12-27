'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Task, TaskStatus, TaskPriority } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormField, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  status: z.enum(['Todo', 'InProgress', 'Review', 'Done']),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  assignedTo: z.string().email('Invalid email'),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  projectId: string
  task?: Task | null
  onSave: (task: Task) => void
  onCancel: () => void
}

export function TaskForm({ projectId, task, onSave, onCancel }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
      }
      : {
        title: '',
        description: '',
        status: 'Todo',
        priority: 'Medium',
        assignedTo: '',
      },
  })

  const onSubmit = (data: TaskFormData) => {
    const now = new Date().toISOString()
    const newTask: Task = task
      ? {
        ...task,
        ...data,
        updatedAt: now,
      }
      : {
        id: `task-${Date.now()}`,
        projectId,
        ...data,
        createdAt: now,
        updatedAt: now,
      }

    onSave(newTask)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{task ? 'Edit Task' : 'Add New Task'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField>
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter task title"
              aria-invalid={!!errors.title}
            />
            {errors.title && <FormMessage>{errors.title.message}</FormMessage>}
          </FormField>

          <FormField>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Enter task description"
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
                <option value="Todo">To Do</option>
                <option value="InProgress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
              </select>
              {errors.status && <FormMessage>{errors.status.message}</FormMessage>}
            </FormField>

            <FormField>
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                {...register('priority')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              {errors.priority && (
                <FormMessage>{errors.priority.message}</FormMessage>
              )}
            </FormField>
          </div>

          <FormField>
            <Label htmlFor="assignedTo">Assigned To (Email)</Label>
            <Input
              id="assignedTo"
              type="email"
              {...register('assignedTo')}
              placeholder="user@example.com"
              aria-invalid={!!errors.assignedTo}
            />
            {errors.assignedTo && (
              <FormMessage>{errors.assignedTo.message}</FormMessage>
            )}
          </FormField>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{task ? 'Update Task' : 'Add Task'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
