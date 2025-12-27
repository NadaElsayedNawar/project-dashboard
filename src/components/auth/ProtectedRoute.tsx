'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/hooks/redux'
import { UserRole } from '@/types'
import { hasPermission } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (requiredRole && user && !hasPermission(user.role, requiredRole)) {
      router.push('/unauthorized')
    }
  }, [isAuthenticated, user, requiredRole, router])

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole && user && !hasPermission(user.role, requiredRole)) {
    return null
  }

  return <>{children}</>
}
