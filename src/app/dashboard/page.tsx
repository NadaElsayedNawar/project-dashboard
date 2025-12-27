'use client'

import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  setProjects,
  setFilter,
  setPagination,
  setSortBy,
  setLoading,
} from '@/store/slices/projectsSlice'
import { getMockProjects } from '@/lib/mockData'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProjectTable } from '@/components/dashboard/ProjectTable'
import { ProjectFilters } from '@/components/dashboard/ProjectFilters'
import { Pagination } from '@/components/dashboard/Pagination'
import { ProjectCharts } from '@/components/dashboard/ProjectCharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Project } from '@/types'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const {
    projects,
    filters,
    pagination,
    sortBy,
    loading,
  } = useAppSelector((state) => state.projects)

  useEffect(() => {
    const fetchProjects = async () => {
      dispatch(setLoading(true))
      try {
        const data = await getMockProjects()
        dispatch(setProjects(data))
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        dispatch(setLoading(false))
      }
    }

    fetchProjects()
  }, [dispatch])

  const { filteredProjects, totalItems, totalPages } = useMemo(() => {
    let filtered = [...projects]

    if (filters.search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.status !== 'All') {
      filtered = filtered.filter((p) => p.status === filters.status)
    }

    filtered.sort((a, b) => {
      const aValue = a[sortBy.field]
      const bValue = b[sortBy.field]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortBy.order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortBy.order === 'asc' ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / pagination.pageSize)

    const startIndex = (pagination.currentPage - 1) * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize

    return {
      filteredProjects: filtered.slice(startIndex, endIndex),
      totalItems,
      totalPages,
    }
  }, [projects, filters, sortBy, pagination.currentPage, pagination.pageSize])

  useEffect(() => {
    dispatch(
      setPagination({
        totalItems,
        totalPages,
      })
    )
  }, [totalItems, totalPages, dispatch])

  const handleSort = (field: keyof Project) => {
    dispatch(
      setSortBy({
        field,
        order: sortBy.field === field && sortBy.order === 'asc' ? 'desc' : 'asc',
      })
    )
  }

  const handleSearchChange = (value: string) => {
    dispatch(setFilter({ search: value }))
    dispatch(setPagination({ currentPage: 1 }))
  }

  const handleStatusChange = (value: typeof filters.status) => {
    dispatch(setFilter({ status: value }))
    dispatch(setPagination({ currentPage: 1 }))
  }

  const handlePageChange = (page: number) => {
    dispatch(setPagination({ currentPage: page }))
  }

  const handlePageSizeChange = (pageSize: number) => {
    dispatch(setPagination({ pageSize, currentPage: 1 }))
  }

  const stats = useMemo(() => {
    const total = projects.length
    const inProgress = projects.filter((p) => p.status === 'InProgress').length
    const completed = projects.filter((p) => p.status === 'Completed').length
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)

    return { total, inProgress, completed, totalBudget }
  }, [projects])

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage and track all your projects in one place
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgress}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(stats.totalBudget / 1000).toFixed(0)}k
                </div>
              </CardContent>
            </Card>
          </div>

          <ProjectCharts projects={projects} />

          <ProjectFilters
            search={filters.search}
            status={filters.status}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
          />

          <ProjectTable
            projects={filteredProjects}
            loading={loading}
            onSort={handleSort}
            sortField={sortBy.field}
            sortOrder={sortBy.order}
          />

          {!loading && pagination.totalPages > 0 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              totalItems={pagination.totalItems}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
