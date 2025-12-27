'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { setCurrentProject, updateProject, addTask, updateTask, deleteTask } from '@/store/slices/projectsSlice'
import { getMockProjectById } from '@/lib/mockData'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectDetailsEdit } from '@/components/projects/ProjectDetailsEdit'
import { TaskList } from '@/components/projects/TaskList'
import { TaskForm } from '@/components/projects/TaskForm'
import { format } from 'date-fns'
import { Project, Task } from '@/types'

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentProject } = useAppSelector((state) => state.projects)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      try {
        const project = await getMockProjectById(params.id as string)
        if (project) {
          dispatch(setCurrentProject(project))
        } else {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Failed to fetch project:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.id, dispatch, router])

  const handleProjectUpdate = (updatedProject: Project) => {
    dispatch(updateProject(updatedProject))
    dispatch(setCurrentProject(updatedProject))
    setIsEditing(false)
  }

  const handleTaskAdd = (task: Task) => {
    dispatch(addTask(task))
    setShowTaskForm(false)
  }

  const handleTaskUpdate = (task: Task) => {
    dispatch(updateTask(task))
    setEditingTask(null)
  }

  const handleTaskDelete = (taskId: string) => {
    if (currentProject) {
      dispatch(deleteTask({ projectId: currentProject.id, taskId }))
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (!currentProject) {
    return null
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="mb-2"
              >
                ← Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">
                {currentProject.name}
              </h1>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>Edit Project</Button>
            )}
          </div>

          {isEditing ? (
            <ProjectDetailsEdit
              project={currentProject}
              onSave={handleProjectUpdate}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Description
                    </p>
                    <p className="mt-1">{currentProject.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Status
                      </p>
                      <Badge className="mt-1">{currentProject.status}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Progress
                      </p>
                      <p className="mt-1 font-medium">{currentProject.progress}%</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Start Date
                      </p>
                      <p className="mt-1">
                        {format(new Date(currentProject.startDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        End Date
                      </p>
                      <p className="mt-1">
                        {format(new Date(currentProject.endDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Budget
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      ${currentProject.budget.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Completion</span>
                      <span className="text-sm text-muted-foreground">
                        {currentProject.progress}%
                      </span>
                    </div>
                    <div className="w-full h-4 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${currentProject.progress}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Tasks
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {currentProject.tasks.length}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Completed
                      </p>
                      <p className="mt-1 font-bold text-green-600">
                        {currentProject.tasks.filter((t) => t.status === 'Done').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        In Progress
                      </p>
                      <p className="mt-1 font-bold text-blue-600">
                        {
                          currentProject.tasks.filter((t) => t.status === 'InProgress')
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>Manage project tasks and assignments</CardDescription>
                </div>
                {!showTaskForm && !editingTask && (
                  <Button onClick={() => setShowTaskForm(true)}>Add Task</Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {(showTaskForm || editingTask) && (
                <div className="mb-6">
                  <TaskForm
                    projectId={currentProject.id}
                    task={editingTask}
                    onSave={editingTask ? handleTaskUpdate : handleTaskAdd}
                    onCancel={() => {
                      setShowTaskForm(false)
                      setEditingTask(null)
                    }}
                  />
                </div>
              )}
              <TaskList
                tasks={currentProject.tasks}
                onEdit={setEditingTask}
                onDelete={handleTaskDelete}
              />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
