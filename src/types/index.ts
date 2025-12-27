export type UserRole = 'Admin' | 'ProjectManager' | 'Developer'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

export type ProjectStatus = 'Planning' | 'InProgress' | 'OnHold' | 'Completed' | 'Cancelled'
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical'
export type TaskStatus = 'Todo' | 'InProgress' | 'Review' | 'Done'

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  startDate: string
  endDate: string
  progress: number
  budget: number
  tasks: Task[]
  createdAt: string
  updatedAt: string
}

export interface ProjectsState {
  projects: Project[]
  currentProject: Project | null
  loading: boolean
  error: string | null
  filters: {
    status: ProjectStatus | 'All'
    search: string
    priority: TaskPriority | 'All'
    assignedUser: string
  }
  pagination: {
    currentPage: number
    pageSize: number
    totalPages: number
    totalItems: number
  }
  sortBy: {
    field: keyof Project
    order: 'asc' | 'desc'
  }
}
