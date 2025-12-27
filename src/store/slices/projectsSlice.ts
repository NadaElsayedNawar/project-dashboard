import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProjectsState, Project, Task, ProjectStatus, TaskPriority } from '@/types'

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  filters: {
    status: 'All',
    search: '',
    priority: 'All',
    assignedUser: '',
  },
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0,
  },
  sortBy: {
    field: 'name',
    order: 'asc',
  },
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload
      state.pagination.totalItems = action.payload.length
      state.pagination.totalPages = Math.ceil(
        action.payload.length / state.pagination.pageSize
      )
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload)
      state.pagination.totalItems += 1
      state.pagination.totalPages = Math.ceil(
        state.pagination.totalItems / state.pagination.pageSize
      )
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.projects[index] = action.payload
      }
      if (state.currentProject?.id === action.payload.id) {
        state.currentProject = action.payload
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload)
      state.pagination.totalItems -= 1
      state.pagination.totalPages = Math.ceil(
        state.pagination.totalItems / state.pagination.pageSize
      )
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload
    },
    addTask: (state, action: PayloadAction<Task>) => {
      if (state.currentProject) {
        state.currentProject.tasks.push(action.payload)
      }
      const projectIndex = state.projects.findIndex(
        (p) => p.id === action.payload.projectId
      )
      if (projectIndex !== -1) {
        state.projects[projectIndex].tasks.push(action.payload)
      }
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      if (state.currentProject) {
        const taskIndex = state.currentProject.tasks.findIndex(
          (t) => t.id === action.payload.id
        )
        if (taskIndex !== -1) {
          state.currentProject.tasks[taskIndex] = action.payload
        }
      }
      const projectIndex = state.projects.findIndex(
        (p) => p.id === action.payload.projectId
      )
      if (projectIndex !== -1) {
        const taskIndex = state.projects[projectIndex].tasks.findIndex(
          (t) => t.id === action.payload.id
        )
        if (taskIndex !== -1) {
          state.projects[projectIndex].tasks[taskIndex] = action.payload
        }
      }
    },
    deleteTask: (state, action: PayloadAction<{ projectId: string; taskId: string }>) => {
      if (state.currentProject?.id === action.payload.projectId) {
        state.currentProject.tasks = state.currentProject.tasks.filter(
          (t) => t.id !== action.payload.taskId
        )
      }
      const projectIndex = state.projects.findIndex(
        (p) => p.id === action.payload.projectId
      )
      if (projectIndex !== -1) {
        state.projects[projectIndex].tasks = state.projects[
          projectIndex
        ].tasks.filter((t) => t.id !== action.payload.taskId)
      }
    },
    setFilter: (
      state,
      action: PayloadAction<Partial<ProjectsState['filters']>>
    ) => {
      state.filters = { ...state.filters, ...action.payload }
      state.pagination.currentPage = 1
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<ProjectsState['pagination']>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    setSortBy: (
      state,
      action: PayloadAction<ProjectsState['sortBy']>
    ) => {
      state.sortBy = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setProjects,
  addProject,
  updateProject,
  deleteProject,
  setCurrentProject,
  addTask,
  updateTask,
  deleteTask,
  setFilter,
  setPagination,
  setSortBy,
  setLoading,
  setError,
} = projectsSlice.actions

export default projectsSlice.reducer
