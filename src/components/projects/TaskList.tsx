'use client'

import { Task, TaskStatus, TaskPriority } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Done':
        return 'default'
      case 'InProgress':
        return 'default'
      case 'Review':
        return 'secondary'
      case 'Todo':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'Critical':
        return 'destructive'
      case 'High':
        return 'default'
      case 'Medium':
        return 'secondary'
      case 'Low':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tasks yet. Click "Add Task" to create one.
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-muted-foreground truncate max-w-md">
                      {task.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(task.status)}>
                  {task.status === 'InProgress' ? 'In Progress' : task.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{task.assignedTo}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (
                        confirm('Are you sure you want to delete this task?')
                      ) {
                        onDelete(task.id)
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
